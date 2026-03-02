# 🌍 Projet Globe Collaboratif - Guide d'Intégration

Bienvenue sur le projet central du globe 3D ! Pour que votre objet modélisé apparaisse sur la carte interactive, vous devez ajouter votre dossier de projet dans le répertoire `/public/projets/` de ce dépôt. 

L'application fonctionne avec un système d'**Iframe**. Cela signifie que votre projet s'affichera dans une "boîte" isolée : vous êtes 100% libres d'utiliser les technologies que vous voulez (Google Model Viewer, Three.js, Bootstrap, CSS pur...) sans avoir peur de casser le site principal !

## 📂 1. Structure obligatoire de votre dossier

Créez un dossier avec votre prénom et nom (ex: `jean-dupont`) et placez-y vos fichiers. La structure de votre dossier **doit** ressembler à ceci :

```text
📁 public/projets/jean-dupont/
 ├── 📄 infos.json         <-- Obligatoire : vos coordonnées
 ├── 📄 index.html         <-- Obligatoire : votre page principale
 ├── 📄 style.css          <-- (ou tout autre fichier CSS)
 └── 📁 assets/            <-- Vos modèles 3D (.glb), images, js...
```

## ⚙️ 2. Le fichier `infos.json`

Ce fichier permet au système de placer votre point sur le globe. **Il doit être à la racine de votre dossier et respecter exactement ce format :**

```json
{
  "id": "jean-dupont",
  "auteur": "Jean Dupont",
  "titre_objet": "Statue de la Liberté",
  "latitude": 40.6892,
  "longitude": -74.0445,
  "description_courte": "Modélisation 3D de la Statue de la Liberté à New York."
}
```

## ⚠️ 3. Règles d'or pour le code (Très important)

* **Prêt à l'emploi :** Votre fichier `index.html` doit s'afficher correctement si vous double-cliquez dessus sur votre propre ordinateur.
* **Pas de code à compiler :** Le projet global ne compilera pas votre code. Si vous utilisez du **SCSS** ou du **Tailwind** (via npm), vous devez **compiler votre CSS vous-mêmes** et inclure le fichier `.css` classique généré dans votre dossier final.
* **CDN autorisés :** Si vous utilisez Tailwind via CDN ou Bootstrap via CDN dans votre balise `<head>`, ça fonctionnera parfaitement.
* **Chemins relatifs :** Dans votre `index.html`, assurez-vous que tous vos liens vers vos images ou modèles 3D sont des chemins relatifs (ex: `src="./assets/model.glb"` et non pas `src="/assets/model.glb"`).

## 🚀 4. Lancer le projet localement

Si vous souhaitez tester le globe avec votre projet, suivez ces étapes :

1. Clonez ce dépôt.
2. Installez les dépendances : `npm install`
3. Lancez le serveur de développement : `npm run dev` (Un script se chargera automatiquement de mettre à jour la liste des projets avant le lancement !).
4. Ouvrez `http://localhost:5173` dans votre navigateur.
