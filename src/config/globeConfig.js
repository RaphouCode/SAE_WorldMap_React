/**
 * Configuration globale du rendu 3D de la Terre.
 * Modifiez ces valeurs pour ajuster l'aspect visuel sans toucher au code principal.
 */
export const globeConfig = {
    // -- TEXTURES & ASSETS --
    assets: {
        dayMap2k: '/assets/2k_earth_daymap.jpg',
        dayMap8k: '/assets/8k_earth_daymap.jpg',
        clouds2k: '/assets/2k_earth_clouds.jpg',
        clouds8k: '/assets/8k_earth_clouds.jpg',
        stars2k: '/assets/2k_stars_milky_way.jpg',
        stars8k: '/assets/8k_stars_milky_way.jpg',
        normalMap2k: '/assets/2k_earth_normal_map.png',
        normalMap8k: '/assets/8k_earth_normal_map.png',
        specularMap2k: '/assets/2k_earth_specular_map.png',
        specularMap8k: '/assets/8k_earth_specular_map.png',
    },

    // -- LUMIERES --
    lights: {
        ambientIntensity: 1.5,    // Lumière globale (compense les textures SRGB sombres)
        directionalIntensity: 1.8 // Puissance du "Soleil"
    },

    // -- RENDU DE LA TERRE (Material) --
    material: {
        normalScale: 3,        // Intensité du relief (1-5 recommandé)
        specularColor: 'grey',   // Couleur des reflets sur l'eau
        shininess: 15,          // Taille/éclat du reflet (plus haut = petit/net)
    },

    // -- COUCHE DE NUAGES --
    clouds: {
        opacity: 0.8,           // Transparence (0 = invisible, 1 = opaque)
        altitude: 1.01,         // Hauteur par rapport à la surface (1.0 = collé)
        rotationSpeed: 0.0003,  // Vitesse de rotation propre
        segments: 120,          // Qualité géométrique de la sphère des nuages
        poleFade: 0.15,         // Force de la disparition aux pôles (0 = pas de fade, 0.5 = fade total)
    },

    // -- ATMOSPHÈRE & CADASTRAGE --
    atmosphere: {
        show: true,
        color: '#8a2269',       // Couleur du halo nocturne
        altitude: 0.25,         // Épaisseur du halo
    },

    // -- CONTRÔLES & CAMERA --
    controls: {
        autoRotate: true,
        autoRotateSpeed: 0.2,
        minDistance: 120,       // Zoom maximum (proche)
        maxDistance: 400,       // Zoom minimum (éloigné)
    }
};
