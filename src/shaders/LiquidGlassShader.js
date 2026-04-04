import * as THREE from 'three';

export const LiquidGlassShader = {
    uniforms: {
        'tDiffuse':           { value: null },
        'uResolution':        { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },

        // UI panel bounding boxes (normalized: x1, y1, x2, y2 in UV space)
        'uTopbarBounds': { value: new THREE.Vector4(-1.0, -1.0, -1.0, -1.0) },
        'uSidebarBounds': { value: new THREE.Vector4(-1.0, -1.0, -1.0, -1.0) },

        // --- Tuning Uniforms ---
        'uCornerRadius': { value: 16.0 },       // Corner radius in pixels
        'uRefractionStrength': { value: 0.035 },      // Lens distortion magnitude
        'uChromaticAberration': { value: 0.012 },     // Spectral dispersion spread
        'uBlurStrength': { value: 0.6 },        // Frosted glass roughness (0.0=clear, 1.0=opaque)
        'uDispersionSamples': { value: 8.0 },         // Chromatic dispersion iterations
        'uTintStrength': { value: 0.15 },        // Adaptive tint/darkening
        'uBevelWidth': { value: 1.5 },         // Inner stroke width in pixels
        'uSpecularPower': { value: 48.0 },        // Specular highlight sharpness
        'uSpecularIntensity': { value: 0.6 },         // Specular highlight brightness
        'uEdgeZone': { value: 0.03 },         // Fraction of panel where distortion applies (extreme bevel only)
    },

    vertexShader: /* glsl */ `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,

    fragmentShader: /* glsl */ `
        precision highp float;

        uniform sampler2D tDiffuse;
        uniform vec2  uResolution;
        uniform vec4  uTopbarBounds;
        uniform vec4  uSidebarBounds;

        uniform float uCornerRadius;
        uniform float uRefractionStrength;
        uniform float uChromaticAberration;
        uniform float uBlurStrength;
        uniform float uDispersionSamples;
        uniform float uTintStrength;
        uniform float uBevelWidth;
        uniform float uSpecularPower;
        uniform float uSpecularIntensity;
        uniform float uEdgeZone;

        varying vec2 vUv;

        // =========================================================
        // 1. SDF: Signed Distance Field for Rounded Rectangle
        //    Canonical formula from Inigo Quilez
        // =========================================================
        float sdRoundRect(vec2 p, vec2 b, float r) {
            vec2 d = abs(p) - b + vec2(r);
            return min(max(d.x, d.y), 0.0) + length(max(d, 0.0)) - r;
        }

        // =========================================================
        // 2. Stochastic Hash Function
        //    High-quality spatial hash for jittering
        // =========================================================
        float hash(vec2 p) {
            return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
        }

        vec2 hash2(vec2 p) {
            return vec2(
                hash(p),
                hash(p + vec2(127.1, 311.7))
            );
        }

        // =========================================================
        // 3. Compute Glass Effect for a Single Panel
        //    Returns: vec4(distortedUV.xy, sdfMask, bevelMask)
        // =========================================================
        struct GlassResult {
            float sdfDist;       // Raw SDF distance (negative = inside)
            float mask;          // Anti-aliased alpha mask
            float distortion;    // Lens distortion magnitude
            vec2  refractDir;    // Direction of refraction offset
            float bevelMask;     // Inner stroke / bevel highlight zone
            float specular;      // Specular highlight intensity
        };

        GlassResult computeGlass(vec2 fragUV, vec4 bounds) {
            GlassResult result;
            result.sdfDist = 1.0;
            result.mask = 0.0;
            result.distortion = 0.0;
            result.refractDir = vec2(0.0);
            result.bevelMask = 0.0;
            result.specular = 0.0;

            // Skip inactive panels
            if (bounds.x < 0.0) return result;

            // Convert bounds to pixel space for SDF
            vec2 boundsMin = bounds.xy * uResolution;
            vec2 boundsMax = bounds.zw * uResolution;
            vec2 glassCenter = (boundsMin + boundsMax) * 0.5;
            vec2 glassSize = boundsMax - boundsMin;
            vec2 halfSize = glassSize * 0.5;

            // Fragment position in pixel space, local to glass center
            vec2 fragPx = fragUV * uResolution;
            vec2 localPos = fragPx - glassCenter;

            // Corner radius clamped to half the smallest dimension
            float r = min(uCornerRadius, min(halfSize.x, halfSize.y) * 0.5);

            // === SDF Evaluation ===
            float dist = sdRoundRect(localPos, halfSize, r);

            // Anti-aliased mask using fwidth derivative
            float edgeSoftness = fwidth(dist);
            float alphaMask = 1.0 - smoothstep(-edgeSoftness, edgeSoftness, dist);

            result.sdfDist = dist;
            result.mask = alphaMask;

            // Only compute effects inside the panel
            if (dist > edgeSoftness * 2.0) return result;

            // === Bevel / Inner Stroke ===
            // Zone just INSIDE the edge (0 to uBevelWidth pixels)
            float innerDist = -dist; // positive inside
            float bevel = smoothstep(uBevelWidth + edgeSoftness, 0.0, innerDist);
            // Gradient: brighter top-left, darker bottom-right (light simulation)
            vec2 normalizedPos = localPos / halfSize;
            float lightGradient = clamp((-normalizedPos.x - normalizedPos.y) * 0.5 + 0.5, 0.0, 1.0);
            result.bevelMask = bevel * lightGradient;

            // === Specular Highlight ===
            // Simulate light source from top-left
            vec3 lightDir = normalize(vec3(-0.5, 0.7, 1.0));
            // SDF gradient as surface normal (analytical)
            vec2 eps = vec2(1.0, 0.0);
            float dxp = sdRoundRect(localPos + eps.xy, halfSize, r);
            float dxn = sdRoundRect(localPos - eps.xy, halfSize, r);
            float dyp = sdRoundRect(localPos + eps.yx, halfSize, r);
            float dyn = sdRoundRect(localPos - eps.yx, halfSize, r);
            vec2 grad2d = vec2(dxp - dxn, dyp - dyn);
            // Create a pseudo-3D normal from 2D gradient with Z component from curvature
            float curvature = smoothstep(0.0, uBevelWidth * 2.0, innerDist);
            vec3 normal3d = normalize(vec3(grad2d * (1.0 - curvature), 1.0));
            // Specular (Blinn-Phong)
            vec3 viewDir = vec3(0.0, 0.0, 1.0);
            vec3 halfVec = normalize(lightDir + viewDir);
            float spec = pow(max(dot(normal3d, halfVec), 0.0), uSpecularPower);
            // Only on bevel zone (inner edge) + slight surface specularity
            result.specular = spec * (bevel * 0.8 + 0.2) * uSpecularIntensity;

            // === Non-linear Lens Distortion (Gravitational Lensing Curve) ===
            float minDim = min(glassSize.x, glassSize.y);
            float inverseSDF = clamp(-dist / minDim, 0.0, 0.5);

            // Remap: 0 at center, 1 at extreme edge (uEdgeZone maps the active zone)
            float distFromCenter = 1.0 - clamp(inverseSDF / uEdgeZone, 0.0, 1.0);

            // Circle equation lens profile: y = 1.0 - sqrt(1.0 - x²)
            // This creates a physically-based lens curvature with zero distortion at center
            // and exponentially increasing distortion toward edges
            float distortionCurve = 1.0 - sqrt(max(1.0 - distFromCenter * distFromCenter, 0.0));

            // Direction: radial from center, "pushing" the view outward
            vec2 direction = length(localPos) > 0.001 ? normalize(localPos) : vec2(0.0);

            result.distortion = distortionCurve * uRefractionStrength;
            result.refractDir = direction;

            return result;
        }

        // =========================================================
        // 4. Main Fragment Shader
        // =========================================================
        void main() {
            // Compute glass for each panel
            GlassResult topbar = computeGlass(vUv, uTopbarBounds);
            GlassResult sidebar = computeGlass(vUv, uSidebarBounds);

            // Determine which panel we're inside (use closest / strongest)
            float totalMask = clamp(topbar.mask + sidebar.mask, 0.0, 1.0);

            // Combined distortion (additive, but should rarely overlap)
            float distortion = max(topbar.distortion * topbar.mask, sidebar.distortion * sidebar.mask);
            vec2 refractDir = topbar.refractDir * topbar.distortion * topbar.mask
                            + sidebar.refractDir * sidebar.distortion * sidebar.mask;

            // Normalize combined direction if both active
            float refractLen = length(refractDir);
            if (refractLen > 0.001) {
                refractDir = normalize(refractDir) * distortion;
            }

            // Apply refraction offset in UV space
            vec2 refractionOffset = refractDir * vec2(1.0, uResolution.x / uResolution.y) * 0.5;

            // === If outside all panels, just output the scene ===
            if (totalMask < 0.001) {
                vec4 scene = texture2D(tDiffuse, vUv);
                // Gamma correction (EffectComposer works in linear space)
                gl_FragColor = vec4(pow(scene.rgb, vec3(1.0 / 2.2)), 1.0);
                return;
            }

            // =====================================================
            // 5. Stochastic Chromatic Dispersion + Mipmap LOD Blur
            //    Single-pass: each dispersion sample uses textureLod
            //    with stochastic jitter for frosted glass roughness.
            //    NO separate blur loop — hardware mipmaps do the work.
            // =====================================================
            vec3 accumulatedColor = vec3(0.0);
            float totalWeight = 0.0;

            // Frosted glass: mipmap LOD level from roughness
            // uBlurStrength 0.0 = crystal clear, 1.0 = fully frosted
            float targetMipLevel = uBlurStrength * 6.0;

            // Seed for stochastic sampling.
            // EXTREMELY IMPORTANT: We do NOT use uTime here! 
            // Animated noise looks like "snow" (bruit numérique/neige).
            // Static noise anchored to screen coordinates looks like the physical 
            // microscopic grain of acid-etched frosted glass.
            vec2 seed = gl_FragCoord.xy;

            // Base refracted UV (center of the distorted read)
            vec2 baseDistortedUV = vUv - refractionOffset;

            // Capture the un-dispersed reference for luminance restoration
            vec3 referenceSample = textureLod(tDiffuse, clamp(baseDistortedUV, 0.001, 0.999), targetMipLevel).rgb;

            float sampleCount = uDispersionSamples;

            for (float i = 0.0; i < 16.0; i++) {
                if (i >= sampleCount) break;

                float t = i / sampleCount; // 0..1 progression through spectrum

                // --- Spectral IOR shift per iteration ---
                // Red is refracted least, Blue most (physical dispersion)
                float spectralShiftR = 1.0;
                float spectralShiftG = 1.0 + uChromaticAberration * (t - 0.5);
                float spectralShiftB = 1.0 + uChromaticAberration * t;

                // --- Stochastic Jitter (Frosted Glass Micro-facet Roughness) ---
                // Amplitude at 0.02 (per report) breaks mipmap block boundaries.
                // The 4-tap rotated cross below averages out the resulting grain.
                vec2 jitterSeed = seed + vec2(i * 7.23, i * 13.71);
                vec2 j1 = (hash2(jitterSeed) * 2.0 - 1.0) * uBlurStrength * 0.02;

                // --- Spatial Denoising: 4-tap rotated cross pattern ---
                // Instead of TAA (temporal anti-aliasing) which requires frame history,
                // we average 4 rotated copies of the jitter offset. This spatially 
                // crushes the stochastic grain into a silky, milky frosted surface.
                vec2 j2 = vec2(-j1.y,  j1.x);  // +90° rotation
                vec2 j3 = -j1;                  // +180° rotation
                vec2 j4 = vec2( j1.y, -j1.x);  // +270° rotation

                // --- Compute base distorted UV per channel (without jitter) ---
                vec2 baseR = baseDistortedUV + refractionOffset * (spectralShiftR - 1.0);
                vec2 baseG = baseDistortedUV + refractionOffset * (spectralShiftG - 1.0);
                vec2 baseB = baseDistortedUV + refractionOffset * (spectralShiftB - 1.0);

                // --- 4-tap averaged mipmap reads per channel ---
                // Each tap reads the hardware-blurred mipmap at a slightly different
                // jittered position. Averaging 4 rotated samples eliminates visible
                // grain while preserving the frosted glass texture.
                float r = 0.0, g = 0.0, b = 0.0;
                for (int tap = 0; tap < 4; tap++) {
                    vec2 jOff = (tap == 0) ? j1 : (tap == 1) ? j2 : (tap == 2) ? j3 : j4;

                    vec2 uvR = clamp(baseR + jOff, 0.001, 0.999);
                    vec2 uvG = clamp(baseG + jOff, 0.001, 0.999);
                    vec2 uvB = clamp(baseB + jOff, 0.001, 0.999);

                    r += textureLod(tDiffuse, uvR, targetMipLevel).r;
                    g += textureLod(tDiffuse, uvG, targetMipLevel).g;
                    b += textureLod(tDiffuse, uvB, targetMipLevel).b;
                }

                accumulatedColor += vec3(r, g, b) * 0.25; // /4 per tap
                totalWeight += 1.0;
            }

            // Normalize accumulated color
            vec3 glassColor = accumulatedColor / totalWeight;

            // =====================================================
            // 6. Luminance Restoration (sRGB ratio compensation)
            //    The dispersion loop darkens the image because
            //    R/G/B channels are sampled at different UV offsets.
            //    We restore luminance by measuring the ratio between
            //    the original (un-dispersed) luminance and the
            //    dispersed result, then scaling to compensate.
            // =====================================================
            float originalLuminance = dot(referenceSample, vec3(0.2126, 0.7152, 0.0722));
            float dispersedLuminance = dot(glassColor, vec3(0.2126, 0.7152, 0.0722));
            // Compute ratio: how much brighter the original is vs dispersed
            float luminanceRatio = originalLuminance / max(dispersedLuminance, 0.001);
            // Clamp to prevent extreme correction on very dark/bright fragments
            luminanceRatio = clamp(luminanceRatio, 0.8, 1.5);
            // Apply correction — restores energy lost by channel separation
            glassColor *= luminanceRatio;

            // =====================================================
            // 7. Adaptive Tinting (visionOS adaptive glass material)
            //    Subtle darkening to improve text readability
            // =====================================================
            // Compute average brightness of the refracted area
            float brightness = dot(glassColor, vec3(0.299, 0.587, 0.114));
            
            // Darken if too bright, lighten if too dark (adaptive)
            float targetBrightness = 0.25; // Target mid-dark for white text readability
            float adaptiveFactor = mix(1.0, targetBrightness / max(brightness, 0.01), uTintStrength * totalMask);
            adaptiveFactor = clamp(adaptiveFactor, 0.5, 1.5);
            glassColor *= adaptiveFactor;

            // =====================================================
            // 8. Bevel Specular Highlights + Inner Stroke
            // =====================================================
            float combinedBevel = max(topbar.bevelMask, sidebar.bevelMask);
            float combinedSpecular = max(topbar.specular, sidebar.specular);

            // Inner stroke (soft white edge glow, fading from top-left to bottom-right)
            vec3 strokeColor = vec3(1.0) * combinedBevel * 0.25;

            // Specular highlights (sharp bright points)
            vec3 specHighlight = vec3(1.0, 0.98, 0.95) * combinedSpecular;

            // Compose final glass color
            glassColor += strokeColor + specHighlight;

            // =====================================================
            // 9. Final Compositing
            // =====================================================
            // Get the un-distorted scene for areas outside panels
            vec4 sceneColor = texture2D(tDiffuse, vUv);

            // Blend glass over scene using SDF mask
            vec3 finalColor = mix(sceneColor.rgb, glassColor, totalMask);

            // =====================================================
            // 10. Global Film Grain (Indie / Premium Web Aesthetic)
            //     Full-frame static photographic grain applied to
            //     the entire image. Luminance-aware: stronger in
            //     midtones, fades in pure blacks and whites for a
            //     cinematic, analog film look.
            // =====================================================
            float grain = hash(gl_FragCoord.xy * 0.7071) * 2.0 - 1.0;
            float luma = dot(finalColor, vec3(0.2126, 0.7152, 0.0722));
            // Parabolic curve: grain peaks at midtones (luma=0.5), fades at extremes
            float grainMask = 1.0 - pow(2.0 * luma - 1.0, 2.0);
            float grainStrength = 0.035;
            finalColor += grain * grainStrength * grainMask;

            // Gamma correction (EffectComposer renders in linear space)
            gl_FragColor = vec4(pow(finalColor, vec3(1.0 / 2.2)), 1.0);
        }
    `
};
