import * as THREE from 'three';

export const BlackHoleShader = {
    uniforms: {
        'tDiffuse': { value: null },
        'uResolution': { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        'uTopbarBounds': { value: new THREE.Vector4(-1.0, -1.0, -1.0, -1.0) },
        'uSidebarBounds': { value: new THREE.Vector4(-1.0, -1.0, -1.0, -1.0) },
        // Apple visionOS Glass spec:
        // Bevel = 2-4px, IOR ~1.1 (très subtil), pas de déformation au centre
        'uBevelPx': { value: 3.0 },            // Bevel width in pixels
        'uRefractionStrength': { value: 0.006 }, // Très subtil, comme IOR ~1.1
    },
    vertexShader: `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform vec2 uResolution;
        uniform vec4 uTopbarBounds;
        uniform vec4 uSidebarBounds;
        uniform float uBevelPx;
        uniform float uRefractionStrength;

        varying vec2 vUv;

        // SDF d'une boîte 2D
        float sdBox(vec2 p, vec2 b) {
            vec2 d = abs(p) - b;
            return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
        }

        // Gradient du SDF = direction perpendiculaire au bord
        vec2 sdBoxGradient(vec2 p, vec2 b) {
            vec2 d = abs(p) - b;
            vec2 s = sign(p);
            if (d.x > 0.0 && d.y > 0.0) {
                return normalize(max(d, 0.0)) * s;
            }
            if (d.x > d.y) {
                return vec2(s.x, 0.0);
            }
            return vec2(0.0, s.y);
        }

        vec2 getCenter(vec4 bounds) {
            return vec2((bounds.x + bounds.z) * 0.5, (bounds.y + bounds.w) * 0.5);
        }
        vec2 getExtents(vec4 bounds) {
            return vec2((bounds.z - bounds.x) * 0.5, (bounds.w - bounds.y) * 0.5);
        }

        // Compute bevel refraction for one UI box
        // Returns vec3(offsetX, offsetY, intensity)
        vec3 computeBevel(vec2 p, vec4 bounds, float aspect, float bevelUv) {
            if (bounds.x < 0.0) return vec3(0.0);

            vec2 center = getCenter(bounds) * vec2(aspect, 1.0);
            vec2 extents = getExtents(bounds) * vec2(aspect, 1.0);

            float d = sdBox(p - center, extents);

            // Le biseau n'agit que dans une bande de bevelUv autour du bord
            // SEULEMENT côté extérieur (d > 0) pour éviter les smears intérieurs
            if (d <= 0.0 || d > bevelUv) return vec3(0.0);

            // Intensité : 1.0 pile sur le bord, 0.0 à bevelUv
            float t = 1.0 - d / bevelUv;
            // Profil de lentille cubique (smoothstep)
            t = t * t * (3.0 - 2.0 * t);

            // Gradient (fausse normale 3D du biseau)
            vec2 normal = sdBoxGradient(p - center, extents);

            // La réfraction pousse les UV vers l'extérieur (repousse la lumière)
            vec2 refractOffset = normal * t * uRefractionStrength;
            refractOffset.x /= aspect;

            return vec3(refractOffset, t);
        }

        void main() {
            float aspect = uResolution.x / uResolution.y;
            vec2 p = vUv * vec2(aspect, 1.0);

            // Convertir la taille du biseau de pixels en UV
            float bevelUv = uBevelPx / uResolution.y;

            // Calculer le biseau pour chaque élément UI
            vec3 bevelTop = computeBevel(p, uTopbarBounds, aspect, bevelUv);
            vec3 bevelSide = computeBevel(p, uSidebarBounds, aspect, bevelUv);

            vec2 totalRefract = bevelTop.xy + bevelSide.xy;
            float intensity = clamp(bevelTop.z + bevelSide.z, 0.0, 1.0);

            // Appliquer la réfraction
            vec2 finalUv = vUv + totalRefract;

            // ANTI-SMEAR : au lieu de clamp (qui étire le dernier pixel),
            // on ramène doucement vers l'UV original quand on approche les bords
            // Cela évite les traînées au bord de l'écran
            vec2 margin = vec2(0.005); // ~5px safe zone
            vec2 fadeToOriginal = smoothstep(vec2(0.0), margin, finalUv)
                                * smoothstep(vec2(0.0), margin, vec2(1.0) - finalUv);
            float edgeFade = fadeToOriginal.x * fadeToOriginal.y;
            finalUv = mix(vUv, finalUv, edgeFade);

            // Sécurité finale
            finalUv = clamp(finalUv, 0.001, 0.999);

            // Aberration chromatique très légère sur le biseau uniquement
            float aberration = 0.002 * intensity;

            vec4 color;
            color.r = texture2D(tDiffuse, clamp(finalUv + vec2(aberration, 0.0), 0.001, 0.999)).r;
            color.g = texture2D(tDiffuse, finalUv).g;
            color.b = texture2D(tDiffuse, clamp(finalUv - vec2(aberration, 0.0), 0.001, 0.999)).b;
            color.a = 1.0;

            // Correction Gamma (EffectComposer = linear)
            gl_FragColor = vec4(pow(color.rgb, vec3(1.0 / 2.2)), 1.0);
        }
    `
};
