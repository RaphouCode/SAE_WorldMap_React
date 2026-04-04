# **Rapport d'Analyse : Conception et Ingénierie d'une Interface Glassmorphism Ultra-Premium en WebGL**

L'émergence de l'informatique spatiale, catalysée de manière décisive par l'introduction du paradigme Apple visionOS, a fondamentalement redéfini les standards architecturaux et esthétiques de l'interface utilisateur (UI). Le passage historique d'écrans bidimensionnels physiques, intrinsèquement opaques, à des environnements tridimensionnels virtuels immersifs exige une refonte totale de l'interaction entre le contenu numérique et la réalité physique environnante.1 Au cœur de cette révolution visuelle et ergonomique se trouve une évolution sophistiquée du "Glassmorphism", une esthétique ultra-premium désignée par Apple sous la nomenclature de "Liquid Glass".3 Ce matériau translucide ne se contente pas de laisser transparaître l'arrière-plan de manière passive ; il le réfracte, le disperse chromatiquement, l'assombrit ou l'éclaircit dynamiquement pour garantir une lisibilité absolue, tout en ancrant physiquement l'interface dans l'espace tridimensionnel de l'utilisateur.4

La reproduction fidèle de cet effet optique complexe au sein d'un navigateur web standard, via les API WebGL et des bibliothèques de haut niveau telles que Three.js, représente un défi d'ingénierie graphique majeur. Elle nécessite une maîtrise exhaustive des mathématiques spatiales non-euclidiennes, de la théorie des Champs de Distance Signés (Signed Distance Fields \- SDF), et de la programmation avancée de shaders (GLSL) pour simuler la physique quantique de la lumière. Il s'agit de reproduire la réfraction de Snell-Descartes, la dispersion chromatique spectrale et le flou de rugosité de surface, tout en maintenant un taux de rafraîchissement impératif de 60 à 120 images par seconde pour éviter toute cinétose en réalité mixte.7 Ce rapport technique et analytique détaille de manière exhaustive les règles esthétiques régissant l'UI spatiale ultra-premium et dissèque les implémentations mathématiques, optiques et algorithmiques nécessaires pour forger une expérience Glassmorphism de pointe en WebGL.

## **Direction Artistique et Lois Fondamentales de l'UI Spatiale**

L'interface spatiale moderne ne peut plus s'appuyer sur des artifices bidimensionnels tels que les ombres portées basiques ou les bordures unies pour simuler la profondeur. L'objectif contemporain est de créer un métamatériau numérique qui réagit dynamiquement à son environnement lumineux tout en guidant l'attention cognitive de l'utilisateur vers l'information cruciale.

La première règle cardinale dictée par les lignes directrices de conception d'Apple (Human Interface Guidelines \- HIG) concerne la priorisation absolue de la transparence. Il est formellement déconseillé d'utiliser des arrière-plans solides et opaques qui bloqueraient la vue de l'utilisateur sur son environnement physique.2 Le système visionOS utilise le "Liquid Glass" comme toile de fond systémique et universelle pour ses fenêtres, créant un sentiment de physicalité ancrée.3 Contrairement aux interfaces traditionnelles où l'empilement de calques translucides (comme le matériau "Acrylic" dans le Fluent Design System de Microsoft) crée inévitablement du bruit visuel et de la confusion spatiale 10, l'approche de l'informatique spatiale repose sur un contrôle algorithmique strict du contraste. L'empilement excessif de matériaux clairs est d'ailleurs proscrit car il détruit la lisibilité, le contraste et la perception de la hiérarchie visuelle.2

Le verre spatial adaptatif module les couleurs de l'arrière-plan de manière contextuelle. Ce matériau intelligent limite la plage des informations colorimétriques de l'arrière-plan, s'assombrissant face à un environnement physique excessivement lumineux et s'éclaircissant dans un environnement sombre, assurant ainsi une harmonie visuelle constante.4 Cette propriété adaptative intrinsèque, combinée à l'absence de "mode sombre" (Dark Mode) explicite au sein du système d'exploitation, permet au contenu numérique de s'intégrer de manière transparente à la réalité de l'utilisateur.11 L'UI spatiale exige de privilégier cette translucidité pour ne pas bloquer le champ de vision (Field of View) périphérique, évitant ainsi de générer un sentiment de claustrophobie ou d'isolement lors de sessions d'utilisation prolongées.2

En matière de lisibilité typographique, les contraintes optiques imposent des ajustements drastiques. Le texte blanc est défini comme le standard absolu sur ces matériaux en verre adaptatif, car il offre le comportement de contraste le plus prévisible face à un arrière-plan en perpétuelle mutation.2 Cependant, la réfraction et le flou de l'arrière-plan tendent à "manger" les contours des polices de caractères minces. Par conséquent, l'épaisseur de la typographie (font-weight) doit être systématiquement revue à la hausse dans les environnements spatiaux. Le texte qui utiliserait une graisse "Regular" sur un écran de smartphone (iOS) nécessite une graisse "Medium" sur visionOS, et un titre "Semi-Bold" doit être converti en "Bold" pour contrer l'interférence visuelle générée par la distorsion du verre.2 De plus, il est crucial d'éviter d'ajouter de la profondeur tridimensionnelle (extrusion ou ombres internes) directement au texte lui-même, car cela perturbe la focalisation oculaire et détruit la clarté de la lecture.13

| Propriété Esthétique | Standard Mobile/Desktop (2D) | Paradigme Spatial (3D / visionOS) |
| :---- | :---- | :---- |
| **Arrière-plan des fenêtres** | Opaque (Blanc/Gris ou Noir) | Matériau adaptatif "Liquid Glass" translucide.4 |
| **Typographie de base** | Noir sur blanc / Blanc sur noir | Exclusivement Blanc pur, indépendamment de l'environnement.2 |
| **Graisse typographique** | Regular / Semi-Bold | Medium / Bold (compensation de la réfraction).2 |
| **Profondeur du texte** | Ombres portées (Drop shadows) | Strictement plat (Z-offset minimal), aucune extrusion 3D.13 |
| **Thématisation (Theme)** | Mode Clair / Mode Sombre bascule | Inexistant. Le verre s'adapte à la luminosité physique.11 |

## **La Topologie Optique du Verre : Biseau, Inner Stroke et Spécularité**

La perception de la matérialité dans un environnement virtuel dépend de détails micro-architecturaux souvent imperceptibles de prime abord. Un simple panneau de verre flouté sans épaisseur perçue ressemble à un vulgaire filtre bidimensionnel apposé sur l'écran. Le "Premium Glassmorphism" requiert la génération d'une illusion de volume physique tangible. C'est ici qu'intervient la gestion micrométrique du biseau (bevel), du contour intérieur (Inner Stroke) et des reflets spéculaires.

Sans un contour intérieur défini, le verre semble fin comme du papier, dénué de toute intégrité structurelle.14 L'application d'un trait intérieur (Inner Stroke) vient résoudre ce défaut perceptif. Dans les outils de conception de l'interface utilisateur tels que Figma, cette technique consiste à ajouter une bordure alignée à l'intérieur de la forme (Inside Stroke), généralement d'une épaisseur d'un ou deux pixels.15 Cette bordure ne doit pas être d'une couleur unie, mais doit arborer un dégradé linéaire subtil (souvent du blanc translucide dans le coin supérieur gauche, s'estompant vers l'invisibilité dans le coin inférieur droit). Ce dégradé simule la manière dont la lumière ambiante frappe l'arête physique biseautée du panneau de verre, lui conférant un aspect tridimensionnel sans nécessiter la complexité d'une véritable géométrie 3D extrudée.14 Ce détail est fondamental : il indique cognitivement à l'utilisateur que l'interface est un objet physique qu'il peut théoriquement saisir et déplacer dans l'espace.

Au-delà du biseau artificiel, le comportement de la lumière sur la surface du matériau définit son identité. Dans un pipeline de rendu basé sur la physique (Physically-Based Rendering \- PBR), la taille et l'intensité de la lumière spéculaire (les reflets de la source lumineuse) dépendent directement de la rugosité (roughness) de la surface. Pour les matériaux diélectriques non métalliques, tels que le verre poli ou les pierres précieuses taillées en facettes, la rugosité est mathématiquement proche de zéro.5 Cependant, les algorithmes PBR standards peinent souvent à créer des éclats spéculaires suffisamment brillants et distincts en se basant uniquement sur cette faible rugosité.

C'est pourquoi, dans des moteurs comme RealityKit d'Apple ou lors de la conception de shaders personnalisés en WebGL, la propriété spéculaire doit être explicitement amplifiée. L'ajout d'une échelle spéculaire additionnelle permet de simuler la façon dont l'environnement lumineux se reflète de manière nette sur la surface lisse du verre, créant des points de brillance (highlights) qui accentuent la perception de l'échelle et du positionnement de la fenêtre par rapport aux sources de lumière de la pièce physique.5 Le système ajoute dynamiquement ces reflets spéculaires et des ombres contextuelles aux vues et aux contrôles, leur donnant une apparence substantielle qui varie continuellement lorsque l'utilisateur modifie son angle de vue ou déplace la fenêtre dans l'espace.11

## **Mathématiques Spatiales : Les Champs de Distance Signés (SDF)**

Pour générer cette interface en WebGL de manière performante, l'ingénierie graphique moderne rejette l'utilisation de géométries 3D denses (des maillages comportant des milliers de polygones pour modéliser les biseaux et les coins arrondis). L'approche de pointe, massivement adoptée dans la communauté des Technical Artists et sur des plateformes comme Shadertoy, s'appuie sur le post-traitement spatialisé et l'évaluation mathématique par Champs de Distance Signés (Signed Distance Fields \- SDF) directement au sein des Fragment Shaders.18

Un SDF est une fonction mathématique pure qui évalue, pour n'importe quel point donné dans l'espace de coordonnées, la distance absolue la plus courte le séparant de la surface d'une forme géométrique définie.19 La convention de signe dicte qu'une valeur négative indique que le point se trouve à l'intérieur du volume de la forme, une valeur positive indique qu'il se trouve à l'extérieur, et une valeur exactement égale à zéro définit la frontière mathématique stricte de la surface. Cette approche algorithmique est redoutablement efficace pour manipuler des géométries complexes, détecter les bords avec une précision sous-pixel, et appliquer des distorsions fluides sans aucune pixellisation.18

Pour une interface typique de type carte, bouton ou fenêtre spatiale, la primitive géométrique de base est le rectangle aux coins arrondis. La formule canonique de ce SDF en deux dimensions, hautement optimisée pour les architectures matérielles GPU et formalisée par des experts comme Inigo Quilez, s'exprime ainsi en langage GLSL 20 :

OpenGL Shading Language

float sdRoundRect(vec2 p, vec2 b, float r) {  
    // 'p' représente la position locale du fragment (pixel) par rapport au centre de la forme.  
    // 'b' représente le vecteur de la demi-taille (extents) du rectangle.  
    // 'r' représente le rayon de courbure des coins.  
      
    // Translation des coordonnées vers le quadrant positif par symétrie absolue.  
    vec2 d \= abs(p) \- b \+ vec2(r);  
      
    // Calcul de la distance Euclidienne pour les coins, combinée à la distance de Manhattan pour les arêtes droites.  
    return min(max(d.x, d.y), 0.0) \+ length(max(d, 0.0)) \- r;  
}

La puissance phénoménale de cette équation réside dans son indépendance totale vis-à-vis de la résolution de l'écran. L'évaluation mathématique permet un anticrénelage (anti-aliasing) parfait, éliminant les effets de crénelage (escalier) caractéristiques de la rastérisation polygonale classique. L'anticrénelage est généralement obtenu en calculant la dérivée spatiale du champ de distance à l'aide de la fonction matérielle fwidth(), puis en lissant le résultat via la fonction d'interpolation cubique smoothstep().19

OpenGL Shading Language

// Exemple d'application d'un anticrénelage parfait basé sur les dérivées  
float distanceSDF \= sdRoundRect(uvLocal, halfSize, cornerRadius);  
float edgeSoftness \= fwidth(distanceSDF);  
float alphaMask \= 1.0 \- smoothstep(0.0, edgeSoftness, distanceSDF);

Au-delà de la simple définition de la forme, le champ de distance permet de dériver instantanément et analytiquement les normales de la surface mathématique en calculant le gradient du SDF. Ces normales sont la clé de voûte pour simuler la lumière spéculaire et, plus important encore, pour définir l'angle de réfraction de la lumière à travers la surface du verre, éliminant de facto le besoin d'un maillage 3D lourd et coûteux en bande passante.

## **Optique Non-Linéaire : Déformation de Lentille Gravitationnelle**

L'une des signatures visuelles les plus impressionnantes de l'esthétique "Liquid Glass" est sa capacité à déformer l'espace situé derrière l'interface. Cette déformation fluide, qui s'apparente conceptuellement à l'effet d'une lentille gravitationnelle ou à la répulsion d'un fluide dense, n'est pas uniforme sur toute la surface de la fenêtre. Pour garantir la lisibilité du texte au centre tout en maximisant le réalisme optique sur les bords, la distorsion s'intensifie de manière non linéaire à l'approche des frontières de la géométrie SDF.1

L'implémentation mathématique de cette déformation spatiale requiert une re-cartographie (remapping) différentielle du champ de distance SDF pour générer une courbe de profil de lentille optique complexe.

La première étape de l'algorithme consiste à normaliser la distance SDF. Il faut inverser la valeur de distance (pour qu'elle soit positive à l'intérieur de la forme) et la diviser par l'échelle de l'élément pour obtenir une métrique locale indépendante de la taille absolue de la fenêtre en pixels. Ensuite, une fonction de restriction (clamp) est utilisée pour isoler la zone d'effet, par exemple en ciblant uniquement les 30% extérieurs du panneau, créant ainsi une zone morte optique au centre.21

OpenGL Shading Language

// Calcul du ratio d'échelle pour normaliser le SDF  
float minSize \= min(glassSize.x, glassSize.y);  
// Inversion et normalisation du SDF  
float inversedSDF \= \-sdRoundRect(glassCoord, glassSize \* 0.5, cornerRadius) / minSize;

// Re-cartographie : 0.0 au centre parfait, approchant 1.0 sur l'extrême bord  
float distFromCenter \= 1.0 \- clamp(inversedSDF / 0.3, 0.0, 1.0);

La deuxième étape fait appel à la modélisation géométrique de la lentille. Pour imiter la courbure d'une optique physique réelle, où l'indice de réfraction effectif croît exponentiellement vers la courbure marginale de la lentille, le shader évalue l'équation d'un cercle : ![][image1]. De cette identité trigonométrique fondamentale, l'algorithme extrait la fonction d'élévation ![][image2]. Cette courbe non linéaire génère un gradient de distorsion parfait pour la réfraction de bord.21

OpenGL Shading Language

// Profil géométrique de la lentille de courbure  
float distortionCurve \= 1.0 \- sqrt(1.0 \- pow(distFromCenter, 2.0));

Enfin, la dernière étape applique ce scalaire de distorsion sous la forme d'un vecteur bidimensionnel. Le décalage (offset) de lecture de texture est calculé en multipliant la force de distorsion par le vecteur de direction normalisé émanant du centre géométrique du verre. Multiplier ce résultat par la demi-taille du panneau reconvertit ce vecteur abstrait en un décalage spatial concret en pixels à l'écran.

OpenGL Shading Language

// Calcul du vecteur d'éviction radiale  
vec2 normalizedDirection \= normalize(glassCoord);  
vec2 refractionOffset \= distortionCurve \* normalizedDirection \* glassSize \* 0.5;

// Soustraction de l'offset pour générer l'illusion de loupe et de répulsion  
vec2 distortedBackgroundUV \= fragCoord \- refractionOffset;

Ce vecteur distortedBackgroundUV sera utilisé pour échantillonner le tampon d'arrière-plan (FBO). Ce processus mathématique précis, exécuté des millions de fois par seconde pour chaque fragment, crée l'illusion parfaite d'un bloc de verre massif et courbé déformant l'espace environnant, évoquant la phénoménologie d'un trou noir modifiant la trajectoire des photons en transit.21

## **Physique de la Lumière : Réfraction et Dispersion Chromatique**

Une fois la topologie mathématique et la déformation spatiale établies, le pinacle du réalisme du "Glassmorphism" ultra-premium repose sur la simulation de la thermodynamique de la lumière, en particulier la réfraction et la dispersion spectrale de ses longueurs d'onde.

La réfraction est régie par la loi de Snell-Descartes, qui quantifie la modification de la trajectoire d'un rayon lumineux lorsqu'il traverse l'interface entre deux milieux de densités optiques différentes. Cette densité est modélisée par l'Indice de Réfraction (IOR \- Index of Refraction). Dans un vide parfait, l'IOR est de ![][image3]. Pour l'air atmosphérique, il est d'environ ![][image4]. Pour un verre standard, l'IOR oscille autour de ![][image5], tandis que des cristaux denses comme le diamant atteignent des valeurs supérieures à ![][image6].22

En GLSL, cette loi physique est encapsulée dans la fonction intrinsèque refract(), qui nécessite un vecteur d'incidence (la direction de la caméra vers le fragment), la normale de la surface (dérivée du SDF ou de la géométrie), et le ratio des indices de réfraction des deux milieux (généralement ![][image7]).23

Cependant, la réalité optique est plus complexe. L'Indice de Réfraction d'un matériau dispersif n'est pas constant : il varie de manière inversement proportionnelle à la longueur d'onde du photon incident. Les hautes fréquences (comme la lumière bleue et violette) se plient selon un angle plus prononcé que les basses fréquences (la lumière rouge). Ce phénomène, responsable de l'apparition des arcs-en-ciel à travers les prismes, est connu en optique sous le nom d'aberration chromatique ou de dispersion chromatique.9 Dans l'ingénierie des lentilles photographiques, cet effet est vigoureusement combattu, mais dans le rendu 3D, sa simulation délibérée confère un niveau de réalisme et une qualité "premium" indéniables à la scène.9

L'approche naïve, fréquemment rencontrée dans des implémentations de shaders de niveau intermédiaire, consiste à diviser l'échantillonnage de l'arrière-plan en trois passes distinctes, correspondant aux canaux Rouge, Vert et Bleu (RGB), en attribuant un IOR légèrement différent à chacun d'eux.23

OpenGL Shading Language

// Approche naïve (séparation RGB à 3 échantillons)  
float iorRatioR \= 1.0 / 1.31;   
float iorRatioG \= 1.0 / 1.33;   
float iorRatioB \= 1.0 / 1.35; 

vec3 refractR \= refract(eyeVector, normal, iorRatioR);  
vec3 refractG \= refract(eyeVector, normal, iorRatioG);  
vec3 refractB \= refract(eyeVector, normal, iorRatioB);

float r \= texture2D(uBackgroundTexture, uv \+ refractR.xy).r;  
float g \= texture2D(uBackgroundTexture, uv \+ refractG.xy).g;  
float b \= texture2D(uBackgroundTexture, uv \+ refractB.xy).b;

Bien que fonctionnelle, cette technique génère un effet de séparation chromatique rudimentaire (RGB shift) composé de bandes colorées dures et distinctes, dépourvues du fondu spectral naturel observé dans la physique réelle.23

Pour atteindre la qualité visuelle exigée par les standards de visionOS, les implémentations avancées (telles que celles étudiées par les artistes techniques Maxime Heckel ou au sein du composant MeshTransmissionMaterial de l'écosystème Poimandres) déploient des stratégies d'échantillonnage stochastique itératif (Multi-sampling dispersion loop).25 Au lieu de limiter le calcul à trois canaux stricts, le Fragment Shader exécute une boucle itérative (for loop) sur un nombre défini d'échantillons. À chaque itération, l'indice de réfraction est progressivement incrémenté.

L'analyse mathématique du code source du MeshTransmissionMaterial de la bibliothèque drei révèle cette mécanique sophistiquée.25 La dispersion est contrôlée par une variable uniforme chromaticAberration. Pour chaque itération de la boucle, le décalage de l'IOR est modulé par le ratio de l'itération courante divisé par le nombre total d'échantillons, souvent perturbé par une coordonnée aléatoire (randomCoords) pour injecter un bruit stochastique qui lisse visuellement le gradient spectral.25

OpenGL Shading Language

// Extrait conceptuel de la boucle de dispersion stochastique  
vec3 transmissionColor \= vec3(0.0);  
float chromaticAberration \= 0.05;   
float samples \= 10.0;

for(float i \= 0.0; i \< samples; i++) {  
    // Calcul du glissement spectral par itération  
    float spectralShift \= chromaticAberration \* (i / samples);  
      
    // Le canal R subit une réfraction de base, G est glissé, B est glissé doublement  
    float sampleR \= texture2D(uBackgroundTexture, uv \+ baseRefractVec \* 1.0).r;  
    float sampleG \= texture2D(uBackgroundTexture, uv \+ baseRefractVec \* (1.0 \+ spectralShift)).g;  
    float sampleB \= texture2D(uBackgroundTexture, uv \+ baseRefractVec \* (1.0 \+ spectralShift \* 2.0)).b;  
      
    transmissionColor \+= vec3(sampleR, sampleG, sampleB);  
}  
// Normalisation par la somme des échantillons  
transmissionColor /= samples;

Certaines recherches mathématiques poussent la complexité plus loin en proposant une expansion de l'espace colorimétrique au-delà du modèle trichromatique RGB. Par le biais de matrices d'interpolation de Fourier, il est possible de diviser le spectre en six canaux distincts : Rouge, Jaune, Vert, Cyan, Bleu et Violet (modèle RYGCBV). Le shader calcule les intensités de ces six bandes de fréquences intermédiaires pour générer une dispersion chromatique d'une douceur absolue.23 Quelle que soit la méthode choisie, ces boucles d'échantillonnages massives réduisent invariablement l'intensité lumineuse globale du fragment. Il est donc indispensable d'implémenter une fonction de restauration de la luminance. Cette correction s'opère en calculant la luminance absolue de la couleur transmise (en multipliant les canaux par les coefficients sRGB standard : ![][image8] via un produit scalaire dot()), puis en interpolant le résultat pour saturer artificiellement les couleurs dispersées.23

| Modèle de Dispersion | Complexité Algorithmique | Fidélité Visuelle | Cas d'Usage Recommandé |
| :---- | :---- | :---- | :---- |
| **RGB Shift (Naïf)** | **![][image9]** (3 lectures de texture) | Basse (bandes colorées séparées) | Effets UI glitch, prototypes rapides. |
| **Multi-Sample Stochastique** | **![][image10]** (N itérations x 3 lectures) | Haute (spectre lissé par le bruit) | Matériaux PBR, MeshTransmissionMaterial.25 |
| **RYGCBV Expansion (Fourier)** | **![][image10]** (Mathématiques matricielles lourdes) | Ultra-Premium (physiquement correct) | Rendus hors-ligne, scènes architecturales statiques.23 |

## **Ingénierie du Flou (Blur) : Optimisation Extreme et Approche Stochastique (Single-Pass)**

L'aspect caractéristique du "verre dépoli" (Frosted Glass), fondamental pour le "Liquid Glass", nécessite d'appliquer un flou gaussien à l'arrière-plan réfracté. Cependant, l'implémentation d'un algorithme de flou performant en temps réel est l'un des problèmes les plus notoirement complexes de la programmation de shaders graphiques.

Un filtre de flou gaussien standard repose sur une matrice de convolution spatiale. La complexité computationnelle de cet algorithme brut croît de manière quadratique (![][image11]) par rapport au rayon du flou, ce qui détruit littéralement les performances d'un GPU lors de l'exécution sur des résolutions modernes (4K ou casques VR).27 La solution mathématique canonique consiste à exploiter la propriété de séparabilité de la fonction gaussienne : un flou 2D massif est décomposé en deux passes de shaders 1D indépendantes (une passe horizontale suivie d'une passe verticale), réduisant la complexité à ![][image10].8

Pourtant, dans un contexte d'interface utilisateur multi-fenêtres, devoir allouer deux Frame Buffers hors-écran (FBO) pour appliquer deux shaders de post-traitement exclusifs pour *chaque* panneau de verre à l'écran engendre un goulot d'étranglement inacceptable au niveau de la bande passante mémoire et de la synchronisation CPU-GPU (Draw Calls).

L'industrie s'est ensuite tournée vers l'algorithme de Kawase, et plus spécifiquement le filtre "Dual Kawase Blur" de Marius Bjørge. Cette architecture évite l'utilisation de larges noyaux de convolution mathématiques. À la place, elle opère une série de passes de sous-échantillonnage (downsampling) de l'image pour en réduire drastiquement la résolution, suivie de passes de sur-échantillonnage (upsampling) avec un filtre en forme de tente (tent filter).29 En rebondissant (ping-ponging) l'image entre des textures de résolutions de plus en plus basses, le GPU effectue un flou visuellement proche d'un Gaussien avec une bande passante minimale. Bien que le Dual Kawase soit exceptionnellement stable temporellement (pas de scintillement) et idéal pour des effets globaux comme le "Bloom", son implémentation reste profondément ancrée dans un paradigme multi-passes (Multi-Pass Architecture), incompatible avec l'objectif de concevoir un shader de composant UI unique et autonome.29

**L'innovation du Flou Stochastique Single-Pass (Jittering & Mipmap LOD)** : Pour résoudre ce dilemme et obtenir un rendu de verre dépoli performant en une seule passe (Single-Pass Execution) au sein du shader responsable du SDF et de la dispersion, les ingénieurs graphiques exploitent désormais une combinaison ingénieuse : l'échantillonnage stochastique couplé à la génération matérielle des Mipmaps GPU.8

Plutôt que d'écrire de lourdes boucles de convolution mathématiques dans le Fragment Shader pour mélanger des dizaines de pixels voisins, le shader s'appuie sur le matériel de texturage intégré à la puce graphique. Lors de la capture de l'arrière-plan dans une texture (FBO), le moteur WebGL génère automatiquement une chaîne de mipmaps (des copies de la texture de résolutions successivement divisées par deux). Échantillonner un niveau de mipmap élevé (Level of Detail ou LOD) revient à lire une version pré-floutée de l'image. En WebGL 2.0 (GLSL ES 3.00), cela s'effectue via la fonction intrinsèque textureLod(sampler, uv, lodLevel).21

Cependant, lire un mipmap brut produit un flou "carré" et numérique (pixelated blur) indésirable. Le secret du "Premium Glassmorphism" consiste à perturber aléatoirement (jittering) les coordonnées de texture avant la lecture du mipmap.

1. **Fonction de Hachage Spatial** : Le shader génère un bruit blanc ou pseud-aléatoire en utilisant les coordonnées d'écran du fragment (gl\_FragCoord.xy) multipliées par des nombres premiers de grande valeur (hash algorithm).  
2. **Décalage Stochastique** : Ce bruit est utilisé pour générer un vecteur de décalage (jitterVec) de très faible amplitude, qui varie d'un pixel à l'autre.  
3. **Lecture Matérielle (textureLod)** : Ce vecteur décalé est ajouté aux coordonnées UV modifiées par la lentille gravitationnelle. Le shader lit alors le mipmap de la texture d'arrière-plan.

OpenGL Shading Language

// Fonction de hachage stochastique  
float hash(vec2 p) {  
    return fract(sin(dot(p, vec2(12.9898, 78.233))) \* 43758.5453);  
}

// Paramètres de rugosité du verre  
float frostedRoughness \= 0.6; // De 0.0 à 1.0  
float targetMipLevel \= frostedRoughness \* 6.0; // Niveau de mipmap dynamique

// Génération du bruit (Jittering)  
vec2 randomJitter \= vec2(hash(uv), hash(uv \+ 1.234)) \* 2.0 \- 1.0;  
vec2 jitteredUV \= distortedBackgroundUV \+ (randomJitter \* frostedRoughness \* 0.02);

// Lecture unique du mipmap avec interpolation matérielle gratuite  
vec3 finalFrostedColor \= textureLod(uBackgroundTexture, jitteredUV, targetMipLevel).rgb;

L'impact de cette technique est double. D'une part, elle est incroyablement légère : elle ne coûte qu'une seule instruction de lecture en mémoire par échantillon (texture fetch), éliminant totalement les boucles de convolution mathématiques du shader.21 D'autre part, le résultat visuel est exceptionnel : le bruit stochastique à l'échelle du pixel introduit un grain granulaire photographique qui simule visuellement les micro-facettes physiques d'un verre chimiquement dépoli, apportant la texture et le mordant optique exigés par le cahier des charges de la direction artistique d'Apple.30

| Algorithme de Flou | Complexité & Structure | Avantage | Inconvénient / Limite pour UI |
| :---- | :---- | :---- | :---- |
| **Gaussian (Brut)** | **![][image11]**, 1 Passe, Lourd | Qualité mathématique pure | Détruit le framerate sur mobile.8 |
| **Gaussian (Séparé)** | **![][image10]**, 2 Passes via FBO | Performant et précis | Exige 2 FBOs par panneau UI.28 |
| **Dual Kawase** | **![][image10]**, \>4 Passes ping-pong | Hyper stable temporellement | Trop complexe à gérer pour un composant React.29 |
| **Stochastic LOD** | **![][image9]**, 1 Passe unique, Mipmap | Très rapide, grain réaliste | Léger bruit nécessitant un anticrénelage TAA si trop fort.21 |

## **Architecture WebGL : Écosystème, Intégration et Études de Cas**

L'intégration de la direction artistique et des équations mathématiques complexes évoquées précédemment dans une application web de production s'articule aujourd'hui presque exclusivement autour de bibliothèques d'abstraction comme Three.js, et plus spécifiquement React Three Fiber (R3F) pour la gestion déclarative du graphe de scène.

### **Le Pipeline de Rendu Hors-Écran (FBO)**

Un principe absolu de la programmation de shaders de transparence post-traitement est le concept du Frame Buffer Object (FBO). Un panneau de verre ne peut mathématiquement pas réfracter ou flouter un arrière-plan si ce dernier n'a pas encore été rendu par le processeur graphique.23 Un fragment shader écrivant sur une texture ne peut lire simultanément cette même texture sans provoquer une collision de type "read-modify-write hazard" dans la mémoire VRAM du GPU.

Par conséquent, l'intégration WebGL exige de modifier le cycle de rendu (render loop) global :

1. Les maillages représentant les éléments UI en verre sont temporairement masqués de la scène (via la propriété visible \= false ou la gestion des couches de rendu).  
2. Le renderer WebGL exécute une passe complète de dessin de l'environnement (fonds, modèles 3D, textes en arrière-plan) dans une cible de rendu spécifique (WebGLRenderTarget).23  
3. La texture de cette passe (texture2D) est injectée comme variable uniforme (uniform sampler2D buffer) dans les matériaux de l'UI en verre.25  
4. Les éléments en verre sont réaffichés, et le GPU effectue la passe de rendu final à l'écran, exécutant les mathématiques SDF, de réfraction et de dispersion en se basant sur la texture fournie.

Dans l'écosystème React Three Fiber, cette gymnastique complexe est simplifiée par des hooks de cycle de vie tels que useFrame et useFBO. Le développeur peut injecter une fonction de rendu personnalisée avant le dessin final, assurant la capture performante de l'environnement.23

### **Étude du Composant "MeshTransmissionMaterial" (Écosystème PMNDRS)**

L'exemple le plus éclatant de réussite open-source mariant tous ces préceptes est le composant MeshTransmissionMaterial, développé par la communauté PMNDRS (Poimandres) et des contributeurs comme N8Programs.25

Ce matériau surpasse largement les capacités du MeshPhysicalMaterial natif de Three.js (qui intègre une forme basique de transmission, mais omet l'aberration chromatique fine et le flou anisotrope).36 Plutôt que d'écrire un ShaderMaterial de zéro et de perdre la gestion des lumières PBR natives de Three.js, le MeshTransmissionMaterial intercepte la compilation du shader via la méthode onBeforeCompile.25 Il injecte dynamiquement ses propres variables uniformes (chromaticAberration, distortion, distortionScale, anisotropicBlur) et modifie le bloc de code (chunk) interne responsable de la transmission (\#include \<transmission\_fragment\>).25

Le code source de ce matériau expose des optimisations remarquables pour la déformation spatiale : il implémente la fonction de bruit snoiseFractal (bruit de Simplex fractal) pour décaler les normales de surface. La variable distortionNormal est générée en appliquant ce bruit en trois dimensions spatiales croisées avec un décalage temporel (temporalOffset), simulant avec perfection l'effet fluide, mouvant et organique du "Liquid Glass" déformant l'arrière-plan sans recourir à des animations de géométrie CPU.25 De plus, le composant React associé masque le maillage hôte automatiquement avant le rendu FBO pour des raisons de performance, résolvant nativement le problème de la récursivité des réflexions.34

### **Plates-formes de R\&D : Shadertoy, Codrops et Awwwards**

L'itération et la recherche graphique précédant ces intégrations se déroulent majoritairement sur des plateformes dédiées aux Fragment Shaders, telles que Shadertoy ou glsl.app.21 Des prototypes spectaculaires y ont prouvé la viabilité mathématique d'une réfraction chromatique couplée à des SDF générant des panneaux de verre courbés en espace écran intégral, démontrant que la géométrie 3D n'était plus un prérequis pour le rendu volumétrique d'interface.21

De nombreuses études de cas publiées sur des portails d'éducation comme Codrops ou honorées sur Awwwards confirment cette méthodologie. Des auteurs tels que Maxime Heckel, Jesper Vos ou Kelly Milligan documentent l'évolution, passant du multi-passes fastidieux pour le flou, à des solutions Single-Pass élégantes exploitant l'équation de Fresnel, le hachage stochastique et la physique de la lumière pour propulser l'interface web vers les standards visuels de l'informatique spatiale exigés par Apple.38

## **Conclusion**

L'édification d'une interface utilisateur Glassmorphism ultra-premium, capable de s'aligner sur les directives esthétiques rigoureuses du "Liquid Glass" de visionOS, transcende la simple implémentation de calques opaques partiellement transparents. C'est un exercice de haute voltige à l'intersection du design cognitif, de la physique optique et de l'ingénierie de bas niveau des puces graphiques.

La réussite esthétique d'un tel projet repose sur une compréhension approfondie de la perception humaine et de l'environnement virtuel. La direction artistique doit impérativement modérer les distorsions optiques dans les zones centrales des éléments d'interface pour sanctuariser le contraste typographique, nécessitant des polices de caractères ajustées et exemptes d'effets tridimensionnels parasites. L'intégration méticuleuse d'un contour interne (Inner Stroke) couplé à des spécularités ciblées demeure l'astuce perceptuelle essentielle pour substituer l'illusion d'une masse volumétrique à la complexité d'une modélisation 3D lourde.

Sur le plan technique et mathématique, l'usage des Champs de Distance Signés (SDF) constitue l'épine dorsale architecturale de ces interfaces, offrant une définition mathématique parfaite des frontières et des vecteurs normaux nécessaires à la manipulation de la lumière. La distorsion spatiale, qui imite les effets de la lentille gravitationnelle, et la dispersion spectrale de la lumière en composantes chromatiques exigent des algorithmes de re-cartographie différentielle non linéaires et des techniques d'échantillonnage stochastique itératif par boucles (multi-sampling) au sein des Fragment Shaders.

Enfin, la viabilité d'exécution à haut taux de rafraîchissement sur des architectures variées repose entièrement sur des choix d'optimisation critiques, tels que l'abandon des algorithmes de convolution de flou multi-passes traditionnels au profit de méthodes single-pass associant le bruit stochastique (Jittering) et les capacités de filtrage mipmap matérielles (LOD). Seule la symbiose parfaite de ces frameworks de post-traitement, orchestrée par des outils comme React Three Fiber et l'écosystème PMNDRS, garantit la genèse d'environnements spatiaux dont le photoréalisme et la fluidité tutoient l'excellence de l'industrie.

#### **Sources des citations**

1. Designing for visionOS | Apple Developer Documentation, consulté le avril 3, 2026, [https://developer.apple.com/design/human-interface-guidelines/designing-for-visionos](https://developer.apple.com/design/human-interface-guidelines/designing-for-visionos)  
2. The Complete Guide to Designing for visionOS \- Think Design, consulté le avril 3, 2026, [https://think.design/blog/the-complete-guide-to-designing-for-visionos/](https://think.design/blog/the-complete-guide-to-designing-for-visionos/)  
3. WWDC25: Meet Liquid Glass | Apple \- YouTube, consulté le avril 3, 2026, [https://www.youtube.com/watch?v=IrGYUq1mklk](https://www.youtube.com/watch?v=IrGYUq1mklk)  
4. Materials | Apple Developer Documentation, consulté le avril 3, 2026, [https://developer.apple.com/design/human-interface-guidelines/materials](https://developer.apple.com/design/human-interface-guidelines/materials)  
5. specular | Apple Developer Documentation, consulté le avril 3, 2026, [https://developer.apple.com/documentation/realitykit/custommaterial/specular-swift.property](https://developer.apple.com/documentation/realitykit/custommaterial/specular-swift.property)  
6. Adopting Liquid Glass | Apple Developer Documentation, consulté le avril 3, 2026, [https://developer.apple.com/documentation/TechnologyOverviews/adopting-liquid-glass](https://developer.apple.com/documentation/TechnologyOverviews/adopting-liquid-glass)  
7. Refraction, Transparency and Dispersion: GLSL Materials in TouchDesigner \- YouTube, consulté le avril 3, 2026, [https://www.youtube.com/watch?v=KR3k7Kj48tU](https://www.youtube.com/watch?v=KR3k7Kj48tU)  
8. Compute shaders in graphics: Gaussian blur \- lisyarus blog, consulté le avril 3, 2026, [https://lisyarus.github.io/blog/posts/compute-blur.html](https://lisyarus.github.io/blog/posts/compute-blur.html)  
9. Simulating Dispersion With OpenGL \- Taylor Petrick, consulté le avril 3, 2026, [https://taylorpetrick.com/blog/post/dispersion-opengl](https://taylorpetrick.com/blog/post/dispersion-opengl)  
10. Glassmorphism: Definition and Best Practices \- NN/G, consulté le avril 3, 2026, [https://www.nngroup.com/articles/glassmorphism/](https://www.nngroup.com/articles/glassmorphism/)  
11. Ensuring interface legibility and contrast in visionOS \- Create with Swift, consulté le avril 3, 2026, [https://www.createwithswift.com/ensuring-interface-legibility-and-contrast-in-visionos/](https://www.createwithswift.com/ensuring-interface-legibility-and-contrast-in-visionos/)  
12. Vision OS UI walkthrough. Exploration of the design aspects in… | by Iolao | Bootcamp, consulté le avril 3, 2026, [https://medium.com/design-bootcamp/vision-os-ui-walkthrough-27902cd43188](https://medium.com/design-bootcamp/vision-os-ui-walkthrough-27902cd43188)  
13. Spatial layout | Apple Developer Documentation, consulté le avril 3, 2026, [https://developer.apple.com/design/human-interface-guidelines/spatial-layout](https://developer.apple.com/design/human-interface-guidelines/spatial-layout)  
14. Liquid Glass: Apple's Stunning New Design Language, consulté le avril 3, 2026, [https://artversion.com/blog/through-the-looking-ui-diving-into-liquid-glass/](https://artversion.com/blog/through-the-looking-ui-diving-into-liquid-glass/)  
15. How to Create Inner Stroke in Figma \[2026 Full Guide\] \- YouTube, consulté le avril 3, 2026, [https://www.youtube.com/watch?v=kfd51GzK-js](https://www.youtube.com/watch?v=kfd51GzK-js)  
16. Apply and adjust stroke properties – Figma Learn \- Help Center, consulté le avril 3, 2026, [https://help.figma.com/hc/en-us/articles/360049283914-Apply-and-adjust-stroke-properties](https://help.figma.com/hc/en-us/articles/360049283914-Apply-and-adjust-stroke-properties)  
17. Windows | Apple Developer Documentation, consulté le avril 3, 2026, [https://developer.apple.com/design/human-interface-guidelines/windows](https://developer.apple.com/design/human-interface-guidelines/windows)  
18. Shape Lens Blur Effect with SDFs and WebGL \- Codrops, consulté le avril 3, 2026, [https://tympanus.net/codrops/2024/06/12/shape-lens-blur-effect-with-sdfs-and-webgl/](https://tympanus.net/codrops/2024/06/12/shape-lens-blur-effect-with-sdfs-and-webgl/)  
19. Drawing Rounded Corners and Borders with SDF. Part 1 \- Medium, consulté le avril 3, 2026, [https://medium.com/@solidalloy/drawing-rounded-corners-and-borders-with-sdf-part-1-rounded-corners-8017bb6ce6f9](https://medium.com/@solidalloy/drawing-rounded-corners-and-borders-with-sdf-part-1-rounded-corners-8017bb6ce6f9)  
20. Formula for a rounded rectangle? : r/opengl \- Reddit, consulté le avril 3, 2026, [https://www.reddit.com/r/opengl/comments/1krenfn/formula\_for\_a\_rounded\_rectangle/](https://www.reddit.com/r/opengl/comments/1krenfn/formula_for_a_rounded_rectangle/)  
21. Liquid Glass: iOS Effect Explanation | by AmirHossein Aghajari ..., consulté le avril 3, 2026, [https://medium.com/@aghajari/liquid-glass-ios-effect-explanation-dabadd6414ae](https://medium.com/@aghajari/liquid-glass-ios-effect-explanation-dabadd6414ae)  
22. Working with Vectors | Apple Developer Documentation, consulté le avril 3, 2026, [https://developer.apple.com/documentation/accelerate/working-with-vectors](https://developer.apple.com/documentation/accelerate/working-with-vectors)  
23. Refraction, dispersion, and other shader light effects \- The Blog of Maxime Heckel, consulté le avril 3, 2026, [https://blog.maximeheckel.com/posts/refraction-dispersion-and-other-shader-light-effects/](https://blog.maximeheckel.com/posts/refraction-dispersion-and-other-shader-light-effects/)  
24. 14.1 Refraction, consulté le avril 3, 2026, [https://www.scss.tcd.ie/Michael.Manzke/CS7055/GLSL/GLSL-3rdEd-refraction.pdf](https://www.scss.tcd.ie/Michael.Manzke/CS7055/GLSL/GLSL-3rdEd-refraction.pdf)  
25. drei-vanilla/src/materials/MeshTransmissionMaterial.ts at main \- GitHub, consulté le avril 3, 2026, [https://github.com/pmndrs/drei-vanilla/blob/main/src/materials/MeshTransmissionMaterial.ts](https://github.com/pmndrs/drei-vanilla/blob/main/src/materials/MeshTransmissionMaterial.ts)  
26. Fusion 2 Shader List \- Darkwire Software, consulté le avril 3, 2026, [https://dark-wire.com/storage/shaderlist.php](https://dark-wire.com/storage/shaderlist.php)  
27. Professional Gaussian Blur | CodeSignal Learn, consulté le avril 3, 2026, [https://codesignal.com/learn/courses/advanced-rendering-and-visual-effects/lessons/professional-gaussian-blur](https://codesignal.com/learn/courses/advanced-rendering-and-visual-effects/lessons/professional-gaussian-blur)  
28. How to effectively blur a single object in a scene with GLSL? : r/opengl \- Reddit, consulté le avril 3, 2026, [https://www.reddit.com/r/opengl/comments/3ddk7u/how\_to\_effectively\_blur\_a\_single\_object\_in\_a/](https://www.reddit.com/r/opengl/comments/3ddk7u/how_to_effectively_blur_a_single_object_in_a/)  
29. Video Game Blurs (and how the best one works) \- FrostKiwi's Secrets, consulté le avril 3, 2026, [https://blog.frost.kiwi/dual-kawase/](https://blog.frost.kiwi/dual-kawase/)  
30. Phenomenological Transparency \- Casual Effects, consulté le avril 3, 2026, [https://casual-effects.com/research/McGuire2017Transparency/McGuire2017Transparency.pdf](https://casual-effects.com/research/McGuire2017Transparency/McGuire2017Transparency.pdf)  
31. Graphics Programming Weekly \- Database \- Jendrik Illner, consulté le avril 3, 2026, [https://www.jendrikillner.com/article\_database/](https://www.jendrikillner.com/article_database/)  
32. Issue \#120 · bioimagesuiteweb/bisweb \- Volume rendering \- GitHub, consulté le avril 3, 2026, [https://github.com/bioimagesuiteweb/bisweb/issues/120](https://github.com/bioimagesuiteweb/bisweb/issues/120)  
33. Building Pinterest Design of a Cube with Chromatic Dispersion in Three.js | by Franky Hung, consulté le avril 3, 2026, [https://franky-arkon-digital.medium.com/building-pinterest-design-of-a-cube-with-chromatic-dispersion-in-three-js-07d007316c84](https://franky-arkon-digital.medium.com/building-pinterest-design-of-a-cube-with-chromatic-dispersion-in-three-js-07d007316c84)  
34. MeshTransmissionMaterial got strange behaviour \- Questions \- three.js forum, consulté le avril 3, 2026, [https://discourse.threejs.org/t/meshtransmissionmaterial-got-strange-behaviour/75182](https://discourse.threejs.org/t/meshtransmissionmaterial-got-strange-behaviour/75182)  
35. MeshTransmissionMaterial \- Drei, consulté le avril 3, 2026, [https://drei.docs.pmnd.rs/shaders/mesh-transmission-material](https://drei.docs.pmnd.rs/shaders/mesh-transmission-material)  
36. MeshPhysicalMaterial.transmission – three.js docs, consulté le avril 3, 2026, [https://threejs.org/docs/\#api/en/materials/MeshPhysicalMaterial.transmission](https://threejs.org/docs/#api/en/materials/MeshPhysicalMaterial.transmission)  
37. Liquid glass with GLSL : r/GraphicsProgramming \- Reddit, consulté le avril 3, 2026, [https://www.reddit.com/r/GraphicsProgramming/comments/1l9abq9/liquid\_glass\_with\_glsl/](https://www.reddit.com/r/GraphicsProgramming/comments/1l9abq9/liquid_glass_with_glsl/)  
38. Creating the Effect of Transparent Glass and Plastic in Three.js \- Codrops, consulté le avril 3, 2026, [https://tympanus.net/codrops/2021/10/27/creating-the-effect-of-transparent-glass-and-plastic-in-three-js/](https://tympanus.net/codrops/2021/10/27/creating-the-effect-of-transparent-glass-and-plastic-in-three-js/)  
39. refraction \- Codrops, consulté le avril 3, 2026, [https://tympanus.net/codrops/tag/refraction/](https://tympanus.net/codrops/tag/refraction/)  
40. Three.js \- Awwwards, consulté le avril 3, 2026, [https://www.awwwards.com/awwwards/collections/three-js/](https://www.awwwards.com/awwwards/collections/three-js/)

[image1]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAYCAYAAAAF6fiUAAADPUlEQVR4Xu2YWahNURjHP6HIPETKnCHKlKFkKDKkRLlKklIyPIoHheKBlKHEi0R4MJWSB0PyoHgQUh6UkgeSN5RQkuH/853dHjrn3H322feec7L/9atz1lr3nrXWt75hLbNCLafJ4mQJPjejuoo2cUbsEX3j3a2rGWKH+QLniXdifmxEc2ib+byY5z7xSAyKjWhR7RZvxFDRTVwXZ2MjGq/e4oGF8xorPogVwYBW1mAxR3QRPcQt81DUbJoiRpU+TzI3wJKwuyHqKTaJ/on2zJpp7g2EpWYWXnvP3DM6WwPFOnFBfBZvxbDogKzqJy6LucmOlJomjiUbO0B4K/NkIxohfne1mCWuWk4GYPOPmrs2eWB8vDuV8J5TycacNV0cFr3MN2JIvLvTddHaMQAVAxuzzHzSxPkJYql5/ELdxX7zk88/4oRtKfXVonoMQDVDQh2RaGduHA5E/D8iRprPc6OYXeprlKoaIAgpO8Ve8UKcEIfEOXHDPOluFn8SrLHaldUAuDJzobYn/0yM9B0Xj80rNMZE5/heDA+HNkQVDcBJPygWlL4zgIFXxFTx0bysyzOJZTEAXnhajBOrxHcLc9AA8VRcMl9PFq03v9ek5Zn5XNKqogGIj1xWOOGIBPlFbDB3a9w3642XzSBk8KNRlpt7VrIdgnkkRcjBO5kTh4PTHoQc8hEHhQtYs6qiAZJi47+Zn9J6ReIjYfMkEIUQ8apMO7R3YRpjHlIORNqYMx7R6DhfTakMwIk9b+7OuHVHKUsICkT4+WHxJxBuvS/NL4pZheclvbEa5Bq8Ma0qGgA3ZjO2mi+AhWCEIJZSBdGXp+oxABer6EKC+M+zCGVxVlE5ra0B6vta7hcVDYDLUylQRSwSP80XiTAOf1hLskmjegxApRZdSJv4Zc0d/xH7WLYa47HquXkFcdP8tfO1eZK8LRaHQ3NTPQbgpFIm3xHXzK/4eeWsvEUOfCi+WlgSc1gwxPbIuH/xj8Fcxsp9z1tZDUBY7GMeapgfIYBwGa2ICqUQ4WNlsjGFdonfFlZKPAR+ssRpKtRxotoh4RJHR4sn5o96tVQjheoQb1N3zePqfbHQst98CxUqVOh/1187+qHt1jsRHQAAAABJRU5ErkJggg==>

[image2]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIoAAAAYCAYAAAAlKWUsAAAD+UlEQVR4Xu2aWahNURjHP/OYeUhmGZKx5OEi3WRIZiFDSUoyKyEi90WhjHVdKUQURZHEg7i8eFBChiKFDHlBZiH+f9/e96y9OsPeOufufa71r1/stfbR2mv997e+b20iTvlWV7AMlNUwnPKsrWAlGAdKaxBOeVRnUA762R1OTqY2g7Ggsd1RBOokGg33g5GgVrDbKV9qJjrRveyOIhBNsgU0Eh3/IzA3cEcRqBuYbTcmUIvAaNDU7oDqgFmiz5JETQIfwCDvmoa/DJpU3ZFQ9QVLwRXwCxwNdidODcBe0Nto49vJBWD7S/AZDDH6kyQaYjio513vAxdAw6o7EioaZSoYBl5I8o0yB0wHLYw2GmW8aMXAsJ5ko5hiQn4PTLY7kqwO4Jkk2yjcVg5LMJrYWi/FYRRGlD1gpmRIZvmwfAhmu3748dU8TVt1qRiMMkU0orS0OwzFbRRGiYnen1Rr0WjH+fXFNd4IRnnXTGrrprpTLuJN18FOo68PeCPxJZNxG4Xbx3Gw1vt7Op0APe1GS3EZhVFhNagA88EDsAMcA+vAY9E15n08TWZOxTln2wavvUpjwCbR8q4SnBKNMNQ88AUM9a7TiWcHzyNwCbT6+8vcitMoHcE18FF0QtNFDO7jNFE7u8NSXEbx19ZfcM4jcz7mgExW/TGVihYNvw0YOAJaIloWlYiawowezH7vgzZGW3UqqlGYpfM3YWD4TbsPe5omOid8A7961/UDd+hL1R/UttptRTEKx8Sx2ePNRLbKhJ8S/NyJlQ1L3tOiWwqrHG6bflAIrTJRt3X3rvkG3RQNrdkmtJDiREQxCvfdgyHZJsEqJZO6gPfgqgSjCsM0DdDWaMukKEbhmDg2e7yZ4DOHUQ/wWnQs/yweElVKym0UowwPYRZ715nE39ouzwbDdFgXRzVKocQF+SZ6PO9HlbNggIR7lihGKZS4TX4HI+yOKPIXxHQb85Mfkvsf5mTNiADfgEyJoa2kGGUgeAfOieZXjCZlEn5LjsMo3AUWggOiLzPTiKeiuRfFF3a3RPwu1R48kZRRWBJzP4szP6F8o8S5/fmiSfhGcrEviponTDShOK+5ioJ8y1/TO6JVzC3RXYOm4VwyCWcwiCT+cI1ojnJINDdh5nvE66tu8ZsJx2Jm4p/AXdEIFocmiEYVTny5aMKZTUweT4K3EqwmXoFdxn2FEo89GInPi1aaK0TXlenFGdHyN/L5GDNnQrfRiSWi+Ulc5ydJ1W3wUzQyhI0mcYpj5BbjV0b2dSTxE/NDSX0tZDJbIXren+t84H/TAtFzozDVUo0Tqxuevi4XNckq0f+PMNi8ycmJ+xTzkxse20VPaZ2cnJycnAqgPwiB8Ui7k1+3AAAAAElFTkSuQmCC>

[image3]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAXCAYAAAD+4+QTAAABPUlEQVR4Xu2UvUvDUBRHr6hQoejgpBUsbg5OgqA4ujgIIg4FZxFcBBcnJ/EfcBQRHEQUZ3Fy6uBax04WCk5uOoj4ce770OSlaRvIIvbAocnN5f4ayH0iPf4CZayExQ4M4w4e4z6OxR9bpnEb7/ADz+KP2zKJNdzEAi5jHeeiTYqGrOICNqX7kAE8wWt37TnEWxyK1H7Q12xI9yFT+IR7QX0NX3E2qBuyhizhpyRDVvALN4K6IWuIH5YWEtYNWUN0SKthuYbsSuthuYakDUurG7KGLOK7JIf5EP3KEnQKGcFx7HP3JXzEI9/g2MJnsfuXwIecy+8gz6jYzX7DeVfTngO8F/sHlEG8wguJL6j53nXT9UjR11Rf8AFnXE8Rb8QeGXqUeHS41i/FHimnWMWJSE8u9Ivd7nX3q/c9/jvf0rBG4yraNTcAAAAASUVORK5CYII=>

[image4]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAD8AAAAXCAYAAAC8oJeEAAADeUlEQVR4Xu2XS6hNURjHvxuKvOIq765XZCCKiCgDiUTCQAzcFCLlccurFMmAgWIgSYQkMjDxlu7FQIwoBiSPPKIYCCV5/H937bX32vvsfc49KIN7/vXrnr322uv7/ut9zWqqqab2riFicbawgnqIdeKw2C76p1+3qk5MEgfEQTFHdEjVcBol9ppra4nokn7dKtonDnV2ihHp17HCthZafjwbLdaIG+KHOJ5+XVYN4r5YITqL2eKxmBjUwfgm0SKGinpxylxSnYJ6JPhIjBPdxC5xTfQM6tAuZdPEWHFB/BJN5uIg/jaay4N65Ei8E5bTmZifL6aIV9Z28x3FEXEu+u21W1y2JNB48U5MjWuYDRMvxKzoebB4IpbGNcx6iXtibfRMe+fFcktGkY68K76Yi4P4y7P/DhHvjZWZ1UwnEmqreRp8KzZnyhdYOhk6g3bD5dBd3BLHzI0UpsNvEOWMWLO5meDz+2Ru1L22mRv9jdEzS4vnuXEN932zuZnCDC1RteZniJ9Wap6gBMcQgQiYNe+TYWQZYRLOmkfkQgfT0SyR/eKKpdsiPvF8HnxTZD6bR6xqzXuTReYpLwqaLSdmkfm8ci+WG8uOvWp6VFbOfHbWxKrWfLbHvULzvs1y5tmt+Z1nspJ5ThDeh5sn65r4LD8vv0QL26rWPGuskvm+4qmVNz9cXLf8xMqZ5xTgu5Oia045+wkdUie2mFuiRW1Vbf5/TntMHRL7LOf4knqb2yxfmzvyVoubVppHrGrNc3R9t2LzTDu/JrNBvXl2fHZ+ToQ8k+TC8TsoKPPGt1py5HFcz4xrlKqPeGh/sdsznQZYcpkYKJ6b26lDrRIfzCWE6JzwGflk/LfzzG1anCBe/qQIEyZ2k9gQ/fYipl/jdFSLWG9JHTqVza7iOc90CRtG9eZuct/E5KiMOtzC7lhyC2NUzorTllx82NAYvTAwN6/3lrRF+1xWdvgKVvod8RrF16j8ZcBHSy5RGGUW+RzIiQ3xqrkZlxK9TWP0PNMVPosHYkxUh48umls/DVEZwjTlZ8xdbY+K25aepohReSZWimXmrrFcqcNOnhDV4Sq8yNwdYI8lu7gfHJ9jiL8LIHK9ZM4wdw1McyXuF73/p2Ld0dskzN/cfyDMjS77AfA7T+zarF2u21x5/1R0GJ1JTiOtdCbXVFNNNbUf/QZnpemyXo9uTAAAAABJRU5ErkJggg==>

[image5]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAXCAYAAABu8J3cAAAB0klEQVR4Xu2VzytEURTHj1DkV35EbMxIykIpSsROIikppSysWFiwo+z9AxYWNrJQFnYiK5GNUopioeRHLCg7Fhbi+33nXXPfHW/0xlio+dan3jv3zL3fue/cc0Wyyiq6YmDMDaZQCxgF1SAHFIMeMG4n+WMdYAksg0GQG8iAmsE02APvYC04nFI0/eFwB1qtHJqYAwcgDirBOlgB+VaeZ2QYdIF7iWZkCFz5HIFZUBrIEGkDj6DbijWAW9Bvxb5UKzoY1ci8G3S0KDov5zcqAYdgVXTHAvoLIwVgW5KNsJb2wTEot+Ke0jXC/F3Rz3MNJiVRiGbBMCNu3FO6RljkFf57o2idsTi55WZOd8GMG+HWEyMuzhNBM3FQI7pT7oIZN/Kd+Hse4wEJXzAs7imqkSbwALZAoRU3RvjZ8sCmJC9ojPDk8AQF9JORMlAniePG/vAqQSPm0zDOcYqn6lm0XxlVgXPRTpskY4QTmcWM2A1PwRvo9GM0xtyY/07xmTVhd01TwPbVwWvgSRJzeeoVTWR7N236BZyJ3iUUt3IHXIJ6P0a1gxOwAGbADdgQNWlrRPRoT4EJcCF6rbh/+FcqAn2i10RMwifnrrJuCJ+zyur/6RPHmGqd6zBVxAAAAABJRU5ErkJggg==>

[image6]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAXCAYAAABu8J3cAAACDElEQVR4Xu2VP0iVURjGHzFBKYkwjCLQwsWpIVCEgqYQJIciaFMaUtpUKAoaHNwyyCFEBwkRHBwaUpAaCreaGnQQRAxRDHQIClTEnue+37n3O+/1/lkahPvAj3vv+53vPc95zznvBSqqqHxdJq/IBBkmLfHjstVEZkmji1eRdjJG3pEuUh2NoNrIJ3Kb3CDz5JgMwRKUqxoyRTZgCwtSjmfkK7lGGsgMbNF6J6M68oE8Rs6hBn4jf8jNJFaOHpJD5BtRjh1yKxW7DhvXGQJ6QYHfsGoEvYRVZTAVK6Zm2Ao/It/IyAmxerIEq2Cm6irNW7KIeOBzmBF9lpJyjMK2+D3iSWthW+2NnCNfyHdyIRWPdIbMkSNyJ350oh7AKqeVeSNhwkJGfDySTrfOR3SYCki3ZJKcT357I2Hr/YQljSjhZzJNzrpnXjL5GmY8yBu5RNZcTCpqRInHyRvYbSqlbuS2JMgbKTRhoXjWxAvkrnEruZsdkS8Z/uk4gB3yLVhjU4V13vyEwYhujm5QRlqRmtdA8j2oj9xP/VbSKyje5HxFJN28XdjCgi6SZVinzUhJe8lfsol4dXvINSE1uR9kn3QkMS/lUsdUnqupuP4uFHuUiqmL/0IqVzjVKqdnG9YBJZVygazCbopXP8x4eFdbpK0JB16VXSdPSA9ZIU9RvLr/TarqvQR9r6ii06d/irV2QS7XllQAAAAASUVORK5CYII=>

[image7]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAAaCAYAAADi4p8jAAADwElEQVR4Xu2YSYhVVxCGS0zAeR5BcSCaOBvUlbpxgIjDIkEcYhwQE4UgiS4kQUQShBgcICoqEVsFFUTiwimIYEsgiAHRoFEUF7pxEdCtutH/o+6x651+LS1i36f4w8d799x6590zVJ2qa9Y8fSB+ElfFbXFRTAz324o1YpeYL34Wf4g+wQb9aJV91Iu/xReiVYNZefpNHDcfcBKDOGf+kFHrxFGrtEWbRJ01DGiIuCemv7AoSR3FX+Kb0PahOGa+YvkKTBK3RL/Q1l6ct8o+BosH4svQVoqGiTtiXGj73Hz2echc08RDq7TH7r/Q1lqsF2dF52RUluaI66JHcc2KsdVOizbJKAifvCt6h7YZ5oPeLA6Y+yI+y0BLF/532Bq2YgfzIIFP5SLo/Cl2WuXWjf4HDDT6YzV1E/uKzzemNJjoO8mfiIy5CBj3xYjQVq0PBtzUDmhR4X9stwlZO5GSlWLFkgaIK+b+GZX7X5qgg+bB6mMxRnwvfhXLRF/zCfxODBLbxTaxt7B/bRHiV5sfA0/EITE63Och94s9YqRYJU6J4cEGLTcPJI/F72Kged+7xUnzyZhrvl27ihXm/tpTfCXmFd9Xis/Ep+b/3WLqYj7bfL6KCC69zH/HyrI6+ONW893C0cT3UaJd8b1axH4rxHn5i/lqsm1ZNdoY9GzzhGKL1YC/1qyevWO8V3NEcOhuLz+oa1Jfi8vmZx8J9sJwj8FMEUfMwz+2F4q2KH4T+6gXl8S35ude6SLj+Mf8XEriwTaan3vxIQnx/5ofxlFUCPXmWQxitemT86xUsUrkneSfUYvMV4EHjWISePA8eyGHjH0ku2r5a4uKioHKgQoiqb95uVStbsP+hnnqlsRg2KKpDyZtgXkaNyAZlSW2HIMhB03iQf/P2pLIIR+Zp1exjUKW1xhUFfgiOWXMW0sT/kdgIFVKYnVyn0wicNy0ytov97+l2XVpYivVWWP/o4DNB43IJa9ZZeCo1gcDZhungrk0JX/KAwbblm1G1ZBEJCWiUhXEqJr7HyLg1ItO4hPzqoBJ+Kj4ZPX5jx/MS6ap5hGbLc5/zMyueecT7eOrkSbF64MT4mnxSeGaxKosNl/FyeYPSKlD4IivHPBD3rxRGtHH2KJ9rXmA4T4uQMnDCvMuhmR6qDgjlpiXS1wzQdhSfjER8ZpJivbRPV5LZPOURmzNV3mXwgRxvKTMhxnHr1l5Hny82PHC2oVbsFLVrvl9bl9ToiLfIGaZF8AEH14uE6UpfmmjPEo+y8TG69yeSW+k5z6d3wTBU1TgAAAAAElFTkSuQmCC>

[image8]: <data:image/png;base64,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>

[image9]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACMAAAAVCAYAAADM+lfpAAACF0lEQVR4Xu2VMUgcQRSG35EEDBiMGpSIaUIa0ULRWKlFENFCAyEQwcZO+yCi1VlY2IgEQUgTrRS0jQEbBa20EyQBA6JIJIra2InG/3dmdPbd7dxqjlT54GO59+Z23+zMvhH5z7+jEBboYIBHsEgHs1EK2+B7WAUfRNMZ1MIvkvDmFhYzAd/pBEnBFrgOv8Ee6xLchq9vh0aohMuwWicsj2EvfKrihJNe1EFWOQZ3JPOhzH2Gp7BO5TgBzi6t4iXwA5wW879d+Nwf4NHu/+DDpuAJbPQTHlyqYzgppgBHDfxhrz4s5i1sgHMSLiaytP3w0l7jKIYbcAs+8+KD8KuEN+6MhIu54RX8Bb/DcpXzccX4N2UBLGTYDYohcTFp+AeOqrjmJTyQ6E155e9ONyiGRMWwL6yIWaLWaCoD5jluFT6xsXr4Gza5QTEkKsbNjBuTGzTEJzFvMO3FWMyevYa4UzG5Br4Q02eOJNpL8loMvwp+HaGBKTgk5q18VLm8FvMQzsJziV939h02LTY99iMfbmp+iR0qrklUDGFH5cN4ruiHvYGHcFxMS9e4N9unEwoWsy/m2MgJ2/9PMWeSO494Nm2KKYhLlQ3GOQlubk2ZmC/vTMwS0wsxRYWa6zU8lflF8ZRm36iQ+CJ8usVMgk3xvnC75AWeumuiDrs7wlMgb3TBecm+r3LBtz+ig38DbzhgTbK0Ps1w4Qoblmbd6huK3gAAAABJRU5ErkJggg==>

[image10]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAVCAYAAAAw73wjAAACkklEQVR4Xu2Wz4uOURTHvzKKkIQRYxJZEGZIlDIWkliwslD+ABZWhFg9m1nMZppQCjVLiWYnPzYUWZidmkZRIhFCllL4ft17uD+e+3jqtXgXvvXped977nPfc88959wX+K/u1zwyOx3sQK3WW0T2kINkHZkZmzNtIuNkQWroQCvJjXRQmkF2ksfkFjnsuUueka1/pkZaQe6R9amBWkwekB+ez2RDNAM45W3Ga7LR24ZskmkWGSEvkDsk2yW4H9mc2LS5MVIl46kOkC9wjlSx6Ze02UdkbTKu9X9Ljlwkn8i20BBIx/+RXED8sqLz1D+bVJEjcNGaJksjKzBILpOeZDzSUfLdP0taSCbJFNxxmk6Tm2hO+rnkClzUtFFF9VA0w6XY8WQs0hryBvW7DGWOviTL/Jick5NnbVJBq+GipfnbyVdym8wJ5ijtdgTfM1VwOxxOxlPpx94idlRPfd9vkwraR076z3JOTspZOS0pCNfQECj1qftwx747NmWSXfNUwfP92BbyDn+JBFwwwvV17AqO5bvyXzVSzE+LiIpEk5t0DnnFytFX/lmS5WdfMKbIKdVUWKvQIj/N0fA469QP10c/IO6VbRwN8zNUBbfxY2iRn6peVXGTozqaM3CLnkhsbRxV/9T7qayIlTp3EHeSTMqJq+QbyjtSX1WjV8NXvw2laOnHVCwlVajPfwXAWpWuyWJ+mnTTyJFx5I7sIu/JKOJWYrITUSOv0xK4aA2kBi9rVaX3M+nKfA53x9v9rrv+CZyz0TUWSOPaoAotVC/cWuH9fR75HxttfgLl06yVFlHl69+S+uJylB0MpVYjp9QLu1r6O/iQ7E0N3ShV9nXU53GnUiD+mZQiuiJFm3RpK61V/QQeAX3joIQK1gAAAABJRU5ErkJggg==>

[image11]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADEAAAAVCAYAAADvoQY8AAAC5ElEQVR4Xu2WTahOURSGX3GL/IXryn9kQC6uRCkZSGLAhIGSMQMj4uZ2B2ciMZBQCnVnJGIkPxPKzYCZEkWJRAgZSuF979qbvffZ5zifv/rKU2/nfHvt75y91llr7Q38558wnNpMnaL6qHGx+e8whhqZDv4GO6hVMGf6qUFqUmAfH9xn0eR11BZqAexBdfRQA2jw4IYoILeoM+73XOoltcFPICuC++8Mo1ZTd6mr1DanG9RjavmPqREzqJvUwtRAOqnb1FenD1R3NAPY52xeL6hFTrPdHAVSTqx1v7N0UIeopygvVjblpRawNLHJ8aNUkYynbKI+whZZxKYhFIg71PzU4OiFBVNfKIsWeZJ6j4pPBIvEO+oEbOEeRfWRu9ZRwHJcUX5ITYmswBLqNDUiGRda01lqYmoI2Ul9cdcqJlD3qAewFPEoQldQX9CjYbmtaCsI+hpboxmWtruTMaFaOwh7hpzois3GPFiu5aIT4p14Rk11Y1q4HFD7q0NFqShr/krqE3WNGhXMUSqrE4WoHg5Ts2Dv3I5yqg9RwCJzIBlP0UJeIXZCV/3e6CdVoI6y191r4XJAjsghoQCdRxxEOXwZ5YLX14zwbUypVFv1MLvmqdOMdWPLqNcoRzClQPx8pZIW5etL9aaazNXDT/GRVMHqQXUcQ7mzyInn7lqFr4fpwZgirvRVZOeguh4a4Z0IUyTHTNg+8RbxXtDEibAeQgpYUHYhXw+NUZdRt6lzQp97P+yFexJbEye0P+j/Kb6hKB2vI+54LaEcPEd9RnUk1KO1yWmz034SkjsKpBTI15uC49vtRfxiPXi0A2uRAygvcg31hjqCuB16/JfUJpZjMizKi1ODw7fbqv+3hHrvE9iZyZ+XdHa6D3Mk3KFDNC7nVfQh2pD0rLA9Hkf5EKnAXEJ1FrSMXqAOpVOr+v40VC8+RO1SC1avb1t0ZB+k1qeGdkMd6ALyddM2KO10rJCapOCfouMbMFmNgGvNmpcAAAAASUVORK5CYII=>