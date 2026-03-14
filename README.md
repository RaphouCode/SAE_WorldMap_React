# 🌍 Projet Globe Collaboratif - Guide d'Intégration & Validation

Bienvenue sur le projet central du globe 3D ! Pour que la modélisation de votre duo/trio apparaisse sur la carte interactive en ligne, vous devez demander l'intégration de votre projet dans ce dépôt via une **Pull Request** (PR).

L'application fonctionne avec un système d'**Iframe**. Cela signifie que votre projet s'affichera dans une "boîte" isolée (prenant tout l'écran au clic) : vous êtes 100% libres d'utiliser les technologies que vous voulez (Google Model Viewer, Three.js, Bootstrap, CSS pur...) sans avoir peur de casser le site principal !

---

## 💻 1. Workflow de contribution (Comment envoyer votre travail)

Puisque vous ne pouvez pas envoyer (push) votre code directement sur la branche principale (`main`), voici la méthode obligatoire :

1. Repérez ou clonez le dépôt sur votre ordinateur.
2. **Créez une nouvelle branche** sur le projet, nommée avec vos noms de famille (ex: `ajout-dupont-martin`).
3. Placez le dossier de votre projet (voir section 2) à l'intérieur du répertoire `/public/projets/`.
4. Effectuez vos commits et **poussez (push)** votre branche sur GitHub.
5. Allez sur la page GitHub du dépôt principal, et cliquez sur le bouton vert **"Compare & pull request"** pour demander l'intégration de votre branche dans le `main`.

> [!WARNING]
> **Ne soumettez votre Pull Request que lorsque votre projet est 100% terminé !** 
> Votre page et modèle 3D doivent être définitifs et testés en local. Ne faites pas de *Pull Request* partielle ou "pour tester" afin d'éviter à l'administrateur de devoir relire et valider de multiples brouillons.

---

## 📂 2. Structure obligatoire de votre dossier

Créez un dossier nommé avec vos noms de famille séparés par des tirets (ex: `dupont-martin`) et placez-y vos fichiers. La structure **doit** ressembler à ceci :

```text
📁 public/projets/dupont-martin/
 ├── 📄 infos.json         <-- Obligatoire : vos coordonnées et auteurs
 ├── 📄 index.html         <-- Obligatoire : votre page principale avec le modèle 3D
 ├── 📄 style.css          <-- (ou tout autre fichier CSS compilé)
 └── 📁 assets/            <-- Vos modèles 3D (.glb), images, js...
```

> [!TIP]
> **Modèle d'exemple** : Un dossier complet `dupont-martin` est déjà présent dans `/public/projets/`. N'hésitez pas à l'ouvrir et à étudier son `index.html` ou son `infos.json` pour comprendre comment configurer correctement votre propre dossier !

---

## ⚙️ 3. Le fichier `infos.json`

Ce fichier permet au système de placer votre point sur le globe et d'indiquer qui a fait quoi. **Il doit respecter exactement ce format :**

```json
{
  "id": "dupont-martin",
  "auteur": "Jean Dupont & Claire Martin",
  "titre_objet": "Statue de la Liberté",
  "latitude": 40.6892,
  "longitude": -74.0445,
  "description_courte": "Modélisation 3D de la Statue de la Liberté par notre duo."
}
```

---

## ⚠️ 4. Règles d'or pour le code (Très important)

* **Prêt à l'emploi :** Votre fichier `index.html` doit s'afficher parfaitement si vous double-cliquez dessus sur votre propre ordinateur.
* **Pas de code à compiler :** Le projet global ne compilera pas votre code. Si vous utilisez du **SCSS** ou du **Tailwind** (via npm), vous devez **compiler votre CSS vous-mêmes** et inclure le fichier `.css` classique généré dans votre dossier.
* **CDN autorisés :** Si vous utilisez Tailwind via CDN, Model-Viewer ou Bootstrap via des balises `<script>` / `<link>` dans `<head>`, ça fonctionnera parfaitement.
* **Chemins relatifs :** Dans votre `index.html` et votre CSS, assurez-vous que tous vos liens vers vos images ou modèles 3D sont des chemins relatifs, commençant par le dossier courant (ex: `src="./assets/model.glb"` et **surtout pas** `src="/assets/model.glb"`).

---

## 👑 5. Guide du validateur (Pour le propriétaire du dépôt)

Quand un groupe fait une Pull Request, son intégration peut être vérifiée de manière expresse (sans même télécharger le code) pour garantir la sécurité du projet :

1. Va dans l'onglet **"Pull requests"** du dépôt GitHub et clique sur la PR du groupe.
2. Rends-toi directement dans l'onglet **"Files changed"** (Fichiers modifiés) en haut de la page.
3. Observe la liste des modifications, GitHub ne te montrera que ce qu'ils cherchent à ajouter. Vérifie visuellement ces 2 points vitaux :
   - **Confinement :** Est-ce que *tous* les fichiers listés commencent bien par `/public/projets/leur-nom/` ?
   - **Protection :** Ont-ils modifié un des fichiers essentiels par erreur (ex: `src/App.jsx`, `package.json`, `prebuild.js`...) ?
4. Si tout est bien confiné : clique en haut à droite sur **Review changes**, sélectionne **Approve**, puis clique sur le bouton vert **Merge pull request**.
5. *Et voilà ! Leur code est intégré sans aucun risque ! Si un fichier hors de leur dossier a été touché, laisse un commentaire explicatif sur la PR et ne valide pas tant que ce n'est pas corrigé.*
