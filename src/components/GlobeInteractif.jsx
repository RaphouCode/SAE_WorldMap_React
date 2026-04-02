import React, { useState, useRef, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import Globe from 'react-globe.gl';
import projetsData from '../data/projets.json';
import './GlobeInteractif.css';

export default function GlobeInteractif() {
    const globeEl = useRef();
    const [selectedProject, setSelectedProject] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const isModalOpen = useRef(false);

    // Custom Cloud Layer configuration
    const [cloudTextureUrl, setCloudTextureUrl] = useState('/assets/2k_earth_clouds.jpg');
    const [cloudsData] = useState([{ id: 'clouds' }]); // Single element dataset for the cloud layer

    // Background and Globe Textures (Progressive Loading)
    const [bgTexture, setBgTexture] = useState('/assets/2k_stars_milky_way.jpg');
    const [globeTexture, setGlobeTexture] = useState('/assets/2k_earth_daymap.jpg');

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

        // Initial rotation & zoom setup
        if (globeEl.current) {
            globeEl.current.controls().autoRotate = true;
            globeEl.current.controls().autoRotateSpeed = 0.2;
            globeEl.current.controls().minDistance = 120;
            globeEl.current.controls().maxDistance = 400;

            // Amélioration de la qualité du rendu global (Anti-aliasing, Resolution)
            const renderer = globeEl.current.renderer();
            if (renderer) {
                // Activer le support de la haute résolution d'écran (Retina, 4K, 2K...)
                renderer.setPixelRatio(window.devicePixelRatio);
                renderer.setSize(window.innerWidth, window.innerHeight);
            }

            // Augmenter drastiquement le relief (bumpScale) et lisser la géométrie
            const applyMaterial = () => {
                let globeMaterial = null;
                // React-globe.gl place la sphère principale dans la scène. On cherche le Mesh qui a la texture de la terre.
                globeEl.current.scene().traverse((child) => {
                    if (child.type === 'Mesh' && child.material && child.material.type === 'MeshPhongMaterial' && child.material.map) {
                        // C'est potentiellement notre Terre
                        globeMaterial = child.material;
                    }
                });

                if (globeMaterial) {
                    globeMaterial.bumpScale = 10;

                    // Améliorer l'interpolation (le lissage) des pixels de la carte 2k
                    if (globeMaterial.map) {
                        globeMaterial.map.minFilter = THREE.LinearFilter;
                        globeMaterial.map.magFilter = THREE.LinearFilter;
                        globeMaterial.map.anisotropy = renderer?.capabilities?.getMaxAnisotropy() || 16;
                        globeMaterial.map.needsUpdate = true;
                    }

                    new THREE.TextureLoader().load('//unpkg.com/three-globe/example/img/earth-water.png', texture => {
                        globeMaterial.specularMap = texture;
                        globeMaterial.specular = new THREE.Color('grey');
                        globeMaterial.shininess = 15;
                        globeMaterial.needsUpdate = true;
                    });
                } else {
                    setTimeout(applyMaterial, 200);
                }
            };
            applyMaterial();
        }

        // --- PROGRESSIVE HIGH-RES TEXTURE LOADING ---
        // Load heavy 8K textures in background and swap them when ready
        const textureLoader = new THREE.TextureLoader();

        textureLoader.load('/assets/8k_earth_daymap.jpg', (hdTexture) => {
            setGlobeTexture('/assets/8k_earth_daymap.jpg');
            if (globeEl.current) {
                // Ensure the new high-res texture gets good filtering
                globeEl.current.scene().traverse((child) => {
                    if (child.type === 'Mesh' && child.material && child.material.type === 'MeshPhongMaterial' && child.material.map) {
                        const renderer = globeEl.current.renderer();
                        hdTexture.minFilter = THREE.LinearFilter;
                        hdTexture.magFilter = THREE.LinearFilter;
                        hdTexture.anisotropy = renderer?.capabilities?.getMaxAnisotropy() || 16;
                        child.material.map = hdTexture;
                        child.material.needsUpdate = true;
                    }
                });
            }
        });

        textureLoader.load('/assets/8k_stars_milky_way.jpg', () => {
            setBgTexture('/assets/8k_stars_milky_way.jpg');
        });

        textureLoader.load('/assets/8k_earth_clouds.jpg', () => {
            setCloudTextureUrl('/assets/8k_earth_clouds.jpg');
        });

        return () => window.removeEventListener('resize', handleResize);
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
            {/* TOP BAR - Glassmorphism */}
            <header className="topbar glass-panel">
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
            <aside className={`sidebar glass-panel ${isSidebarOpen ? 'open' : ''}`}>
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
                bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
                backgroundImageUrl={bgTexture}
                showAtmosphere={true}
                atmosphereColor="#3a228a"
                atmosphereAltitude={0.25}
                customLayerData={cloudsData}
                customThreeObject={() => {
                    const texture = new THREE.TextureLoader().load(cloudTextureUrl);
                    // Rendre les nuages plus hauts en définition (120 segments au lieu de 75)
                    return new THREE.Mesh(
                        new THREE.SphereGeometry(globeEl.current?.getGlobeRadius() * 1.01 || 101, 120, 120),
                        new THREE.MeshPhongMaterial({
                            map: texture,
                            transparent: true,
                            opacity: 0.6,
                            blending: THREE.AdditiveBlending,
                            side: THREE.DoubleSide,
                            depthWrite: false
                        })
                    );
                }}
                customThreeObjectUpdate={(obj) => {
                    // Les nuages tournent très lentement par eux-mêmes, 
                    // et suivent automatiquement la caméra du globe car ils font partie de la scène
                    obj.rotation.y += 0.0003;
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
