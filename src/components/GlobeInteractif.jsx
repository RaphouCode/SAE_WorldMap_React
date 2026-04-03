import React, { useState, useRef, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { BlackHoleShader } from '../shaders/BlackHoleShader';
import Globe from 'react-globe.gl';
import projetsData from '../data/projets.json';
import { globeConfig } from '../config/globeConfig';
import './GlobeInteractif.css';

export default function GlobeInteractif() {
    const globeEl = useRef();
    const topbarRef = useRef(null);
    const sidebarRef = useRef(null);
    const glassPassRef = useRef(null);
    const [selectedProject, setSelectedProject] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const isModalOpen = useRef(false);

    // Track current resolution levels (1: 2k, 2: 8k) to prevent race conditions
    const resLevels = useRef({
        map: 0,
        bump: 0,
        specular: 0,
        clouds: 0,
        bg: 0
    });

    // Store loaded textures so they survive re-renders
    const loadedTextures = useRef({ normal: null, specular: null });

    // Create persistent globe material that we control directly
    const globeMaterial = useMemo(() => new THREE.MeshPhongMaterial({
        shininess: globeConfig.material.shininess,
        specular: new THREE.Color(globeConfig.material.specularColor),
    }), []);

    // Custom Cloud Layer configuration
    const [cloudTextureUrl, setCloudTextureUrl] = useState(globeConfig.assets.clouds2k);
    const [cloudsData] = useState([{ id: 'clouds' }]); // Single element dataset for the cloud layer

    // Background and Globe Textures (Progressive Loading)
    const [bgTexture, setBgTexture] = useState(globeConfig.assets.stars2k);
    const [globeTexture, setGlobeTexture] = useState(globeConfig.assets.dayMap2k);

    const [dimensions, setDimensions] = useState({
        width: window.innerWidth,
        height: window.innerHeight
    });

    useEffect(() => {
        const handleResize = () => {
            setDimensions({
                width: window.innerWidth,
                height: window.innerHeight
            });
        };
        window.addEventListener('resize', handleResize);

        // --- INITIAL 2K LOADING MANAGER ---
        const loadingManager = new THREE.LoadingManager();
        loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
            setLoadingProgress(Math.round((itemsLoaded / itemsTotal) * 100));
        };
        loadingManager.onLoad = () => {
            setTimeout(() => setIsLoading(false), 500);
        };

        const textureLoader2k = new THREE.TextureLoader(loadingManager);

        // Pre-load critical 2k assets
        textureLoader2k.load(globeConfig.assets.dayMap2k, (t) => { resLevels.current.map = 1; });
        textureLoader2k.load(globeConfig.assets.stars2k, (t) => { resLevels.current.bg = 1; });
        textureLoader2k.load(globeConfig.assets.clouds2k, () => { resLevels.current.clouds = 1; });

        textureLoader2k.load(globeConfig.assets.normalMap2k, (t) => {
            resLevels.current.bump = 1;
            t.colorSpace = THREE.NoColorSpace; // Correct pour les calculs de relief
            loadedTextures.current.normal = t;
            globeMaterial.normalMap = t;
            if (globeMaterial.normalScale) {
                globeMaterial.normalScale.set(globeConfig.material.normalScale, globeConfig.material.normalScale);
            }
            globeMaterial.needsUpdate = true;
            console.log('[Globe] 2K Normal map applied (Linear)');
        });
        textureLoader2k.load(globeConfig.assets.specularMap2k, (t) => {
            resLevels.current.specular = 1;
            t.colorSpace = THREE.NoColorSpace; // Correct pour les reflets
            loadedTextures.current.specular = t;
            globeMaterial.specularMap = t;
            globeMaterial.needsUpdate = true;
            console.log('[Globe] 2K Specular map applied (Linear)');
        });

        // Apply lights from config
        const applyLights = () => {
            if (!globeEl.current) {
                setTimeout(applyLights, 500);
                return;
            }
            const scene = globeEl.current.scene();
            scene.traverse((child) => {
                if (child instanceof THREE.AmbientLight) {
                    child.intensity = globeConfig.lights.ambientIntensity;
                    console.log('[Globe] Ambient light set to', globeConfig.lights.ambientIntensity);
                }
                if (child instanceof THREE.DirectionalLight) {
                    child.intensity = globeConfig.lights.directionalIntensity;
                    console.log('[Globe] Directional light set to', globeConfig.lights.directionalIntensity);
                }
            });
        };
        applyLights();

        // Enforce lights and material settings periodically (syncs changes from globeConfig)
        const lightsInterval = setInterval(() => {
            if (!globeEl.current) return;

            // Sync Material properties
            if (globeMaterial) {
                globeMaterial.shininess = globeConfig.material.shininess;
                globeMaterial.specular.set(globeConfig.material.specularColor);
                if (globeMaterial.normalScale) {
                    globeMaterial.normalScale.set(globeConfig.material.normalScale, globeConfig.material.normalScale);
                }
            }

            // Sync Lights
            globeEl.current.scene().traverse((child) => {
                if (child instanceof THREE.AmbientLight) {
                    child.intensity = globeConfig.lights.ambientIntensity;
                }
                if (child instanceof THREE.DirectionalLight) {
                    child.intensity = globeConfig.lights.directionalIntensity;
                }
            });
        }, 1000);

        // Initial setup for rotation/controls
        if (globeEl.current) {
            globeEl.current.controls().autoRotate = globeConfig.controls.autoRotate;
            globeEl.current.controls().autoRotateSpeed = globeConfig.controls.autoRotateSpeed;
            globeEl.current.controls().minDistance = globeConfig.controls.minDistance;
            globeEl.current.controls().maxDistance = globeConfig.controls.maxDistance;

            const renderer = globeEl.current.renderer();
            if (renderer) {
                renderer.setPixelRatio(window.devicePixelRatio);
                renderer.setSize(window.innerWidth, window.innerHeight);
            }
        }

        // --- PROGRESSIVE HIGH-RES TEXTURE LOADING (Silent) ---
        const textureLoader8k = new THREE.TextureLoader();

        textureLoader8k.load(globeConfig.assets.dayMap8k, (hdTexture) => {
            resLevels.current.map = 2;
            setGlobeTexture(globeConfig.assets.dayMap8k);
            console.log('[Globe] 8K daymap loaded');
        });

        textureLoader8k.load(globeConfig.assets.stars8k, (hdBg) => {
            resLevels.current.bg = 2;
            setBgTexture(globeConfig.assets.stars8k);
        });

        textureLoader8k.load(globeConfig.assets.clouds8k, () => {
            resLevels.current.clouds = 2;
            setCloudTextureUrl(globeConfig.assets.clouds8k);
        });

        textureLoader8k.load(globeConfig.assets.normalMap8k, (hdNormal) => {
            resLevels.current.bump = 2;
            hdNormal.colorSpace = THREE.NoColorSpace; // Ensure linear
            loadedTextures.current.normal = hdNormal;
            globeMaterial.normalMap = hdNormal;
            globeMaterial.normalScale.set(globeConfig.material.normalScale, globeConfig.material.normalScale);
            globeMaterial.needsUpdate = true;
            console.log('[Globe] 8K Normal map applied (Linear)');
        });

        textureLoader8k.load(globeConfig.assets.specularMap8k, (hdSpecular) => {
            resLevels.current.specular = 2;
            hdSpecular.colorSpace = THREE.NoColorSpace; // Ensure linear
            loadedTextures.current.specular = hdSpecular;
            globeMaterial.specularMap = hdSpecular;
            globeMaterial.needsUpdate = true;
            console.log('[Globe] 8K Specular map applied (Linear)');
        });

        return () => {
            window.removeEventListener('resize', handleResize);
            clearInterval(lightsInterval);
        };
    }, []);

    // Black Hole Glassmorphism Pass 
    useEffect(() => {
        let animationFrameId;

        const updateGlassmorphism = () => {
            if (globeEl.current && typeof globeEl.current.postProcessingComposer === 'function') {
                const composer = globeEl.current.postProcessingComposer();

                if (!glassPassRef.current && composer) {
                    glassPassRef.current = new ShaderPass(BlackHoleShader);
                    composer.addPass(glassPassRef.current);
                    console.log('[Globe] BlackHole shader pass added');
                }

                if (glassPassRef.current) {
                    glassPassRef.current.uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);

                    if (topbarRef.current) {
                        const r = topbarRef.current.getBoundingClientRect();
                        glassPassRef.current.uniforms.uTopbarBounds.value.set(
                            r.left / window.innerWidth,
                            1.0 - (r.bottom / window.innerHeight),
                            r.right / window.innerWidth,
                            1.0 - (r.top / window.innerHeight)
                        );
                    }
                    if (sidebarRef.current) {
                        const r = sidebarRef.current.getBoundingClientRect();
                        glassPassRef.current.uniforms.uSidebarBounds.value.set(
                            r.left / window.innerWidth,
                            1.0 - (r.bottom / window.innerHeight),
                            r.right / window.innerWidth,
                            1.0 - (r.top / window.innerHeight)
                        );
                    }
                }
            }
            animationFrameId = requestAnimationFrame(updateGlassmorphism);
        };

        updateGlassmorphism();

        return () => cancelAnimationFrame(animationFrameId);
    }, []);

    // Filter projects based on search
    const filteredProjects = useMemo(() => {
        return projetsData.filter(p =>
            p.titre_objet?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.auteur?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm]);

    const flyToProject = (point, openModalDelay = 1200) => {
        if (!globeEl.current) return;

        // Stop auto rotation
        globeEl.current.controls().autoRotate = false;

        // Fly to coordinates with cinematic animation
        globeEl.current.pointOfView({
            lat: point.latitude,
            lng: point.longitude,
            altitude: 1.2
        }, 1000); // 1000ms flight duration

        // Wait for flight to finish before opening modal
        setTimeout(() => {
            setSelectedProject(point);
            isModalOpen.current = true;
        }, openModalDelay);
    };

    const handleMarkerClick = (point) => {
        flyToProject(point, 0); // Open immediately if clicked directly on globe
    };

    const handleSidebarProjectClick = (point) => {
        flyToProject(point, 1200); // Cinematic fly-to if clicked from sidebar
        if (window.innerWidth < 768) setIsSidebarOpen(false); // Close sidebar on mobile
    };

    const closeModal = () => {
        setSelectedProject(null);
        isModalOpen.current = false;
        if (globeEl.current && !isSidebarOpen) {
            globeEl.current.controls().autoRotate = true;
        }
    };

    return (
        <div className="globe-container">
            {/* LOADING OVERLAY */}
            {isLoading && (
                <div className="loading-overlay">
                    <div className="loading-content">
                        <h2>Initialisation du Globe...</h2>
                        <div className="loading-bar-container">
                            <div className="loading-bar-fill" style={{ width: `${loadingProgress}%` }}></div>
                        </div>
                        <p>{loadingProgress}%</p>
                    </div>
                </div>
            )}

            {/* TOP BAR - Glassmorphism */}
            <header ref={topbarRef} className="topbar glass-panel">
                <div className="brand">
                    <h1>SAE 402</h1>
                    <p>Globe Collaboratif</p>
                </div>
                <button
                    className="toggle-sidebar-btn"
                    onClick={() => {
                        setIsSidebarOpen(!isSidebarOpen);
                        if (globeEl.current) globeEl.current.controls().autoRotate = isSidebarOpen;
                    }}
                >
                    {isSidebarOpen ? 'Fermer' : 'Voir les projets'}
                    <span style={{ background: 'rgba(0,255,204,0.2)', padding: '2px 8px', borderRadius: '10px', marginLeft: '5px' }}>{projetsData.length}</span>
                </button>
            </header>

            {/* SIDEBAR - Glassmorphism */}
            <aside ref={sidebarRef} className={`sidebar glass-panel ${isSidebarOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <h2>Projets de Classe</h2>
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Rechercher une oeuvre ou un auteur..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="projects-list">
                    {filteredProjects.length > 0 ? filteredProjects.map((projet) => (
                        <div
                            key={projet.id}
                            className="project-card"
                            style={{ '--card-color': projet.couleur || '#00ffcc' }}
                            onClick={() => handleSidebarProjectClick(projet)}
                        >
                            <h3>{projet.titre_objet || 'Projet sans titre'}</h3>
                            <p className="author">{projet.auteur || 'Anonyme'}</p>
                            <p className="desc">{projet.description_courte}</p>
                        </div>
                    )) : (
                        <p style={{ color: '#888', textAlign: 'center' }}>Aucun projet trouvé.</p>
                    )}
                </div>
            </aside>

            {/* GLOBE 3D */}
            <Globe
                ref={globeEl}
                rendererConfig={{ antialias: true, alpha: true }}
                backgroundColor="rgba(0,0,0,0)"
                width={dimensions.width}
                height={dimensions.height}
                // Utilisation progressive de la version hd (passage à 8k)
                globeImageUrl={globeTexture}
                globeMaterial={globeMaterial}
                backgroundImageUrl={bgTexture}
                showAtmosphere={globeConfig.atmosphere.show}
                atmosphereColor={globeConfig.atmosphere.color}
                atmosphereAltitude={globeConfig.atmosphere.altitude}
                customLayerData={cloudsData}
                customThreeObject={() => {
                    const texture = new THREE.TextureLoader().load(cloudTextureUrl);
                    return new THREE.Mesh(
                        new THREE.SphereGeometry(globeEl.current?.getGlobeRadius() * globeConfig.clouds.altitude || 101, globeConfig.clouds.segments, globeConfig.clouds.segments),
                        new THREE.ShaderMaterial({
                            uniforms: {
                                uTexture: { value: texture },
                                uOpacity: { value: globeConfig.clouds.opacity },
                                uPoleFade: { value: globeConfig.clouds.poleFade }
                            },
                            vertexShader: `
                                varying vec2 vUv;
                                void main() {
                                    vUv = uv;
                                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                                }
                            `,
                            fragmentShader: `
                                uniform sampler2D uTexture;
                                uniform float uOpacity;
                                uniform float uPoleFade;
                                varying vec2 vUv;
                                void main() {
                                    vec4 color = texture2D(uTexture, vUv);
                                    // Utilise la luminosité comme masque alpha (noir = transparent)
                                    float alpha = (color.r + color.g + color.b) / 3.0;
                                    
                                    // Fade progressif aux pôles (vUv.y = 0 et vUv.y = 1)
                                    float fade = smoothstep(0.0, uPoleFade, vUv.y) * smoothstep(1.0, 1.0 - uPoleFade, vUv.y);
                                    
                                    gl_FragColor = vec4(color.rgb, alpha * uOpacity * fade);
                                }
                            `,
                            transparent: true,
                            side: THREE.DoubleSide,
                            depthWrite: false
                        })
                    );
                }}
                customThreeObjectUpdate={(obj) => {
                    obj.rotation.y += globeConfig.clouds.rotationSpeed;
                }}
                htmlElementsData={projetsData}
                htmlLat="latitude"
                htmlLng="longitude"
                htmlElement={d => {
                    const wrapper = document.createElement('div');
                    wrapper.className = 'marker-wrapper';

                    const el = document.createElement('div');
                    el.className = 'marker-dot';
                    if (d.couleur) {
                        el.style.setProperty('--marker-color', d.couleur);
                    }
                    wrapper.appendChild(el);

                    const tooltip = document.createElement('div');
                    tooltip.className = 'marker-tooltip';
                    tooltip.innerHTML = `<b>${d.titre_objet || d.id}</b><i>Par ${d.auteur || 'Inconnu'}</i>`;
                    wrapper.appendChild(tooltip);

                    wrapper.onclick = () => handleMarkerClick(d);
                    wrapper.onmouseenter = () => {
                        if (globeEl.current) globeEl.current.controls().autoRotate = false;
                    };
                    wrapper.onmouseleave = () => {
                        if (globeEl.current && !isModalOpen.current && !isSidebarOpen) {
                            globeEl.current.controls().autoRotate = true;
                        }
                    };
                    return wrapper;
                }}
            />

            {/* MODAL (Iframe) */}
            {selectedProject && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="close-btn" onClick={closeModal}>&times;</button>

                        <div className="iframe-loader">
                            <div className="spinner"></div>
                            <p>Chargement en cours...</p>
                        </div>

                        <div className="iframe-container">
                            <iframe
                                src={`/projets/${selectedProject.id}/index.html`}
                                title={selectedProject.titre_objet}
                                frameBorder="0"
                                allowFullScreen
                            ></iframe>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
