import React, { useState, useRef, useEffect } from 'react';
import Globe from 'react-globe.gl';
import projetsData from '../data/projets.json';
import './GlobeInteractif.css';

export default function GlobeInteractif() {
    const globeEl = useRef();
    const [selectedProject, setSelectedProject] = useState(null);
    const isModalOpen = useRef(false);
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

        // Initial rotation adjustment
        if (globeEl.current) {
            globeEl.current.controls().autoRotate = true;
            globeEl.current.controls().autoRotateSpeed = 0.2;
        }

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleMarkerClick = (point) => {
        setSelectedProject(point);
        isModalOpen.current = true;
        if (globeEl.current) {
            globeEl.current.controls().autoRotate = false;
            globeEl.current.pointOfView({ lat: point.latitude, lng: point.longitude, altitude: 1.5 }, 1000);
        }
    };

    const closeModal = () => {
        setSelectedProject(null);
        isModalOpen.current = false;
        if (globeEl.current) {
            globeEl.current.controls().autoRotate = true;
        }
    };

    return (
        <div className="globe-container">
            <Globe
                ref={globeEl}
                width={dimensions.width}
                height={dimensions.height}
                globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
                bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
                backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
                htmlElementsData={projetsData}
                htmlLat="latitude"
                htmlLng="longitude"
                htmlElement={d => {
                    const wrapper = document.createElement('div');
                    wrapper.className = 'marker-wrapper';

                    const el = document.createElement('div');
                    el.className = 'marker-dot';
                    wrapper.appendChild(el);

                    const tooltip = document.createElement('div');
                    tooltip.className = 'marker-tooltip';
                    tooltip.innerHTML = `<b>${d.titre_objet || d.id}</b><br/><i style="color: #ccc; font-size: 12px;">Par ${d.auteur || 'Inconnu'}</i>`;
                    wrapper.appendChild(tooltip);

                    wrapper.onclick = () => handleMarkerClick(d);
                    wrapper.onmouseenter = () => {
                        if (globeEl.current) globeEl.current.controls().autoRotate = false;
                    };
                    wrapper.onmouseleave = () => {
                        if (globeEl.current && !isModalOpen.current) {
                            globeEl.current.controls().autoRotate = true;
                        }
                    };
                    return wrapper;
                }}
            />

            {selectedProject && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="close-btn" onClick={closeModal}>&times;</button>
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
