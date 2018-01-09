# Process Book

## 16 novembre 2017

choix du sujet sur la thématique des transports 
les premières idées discutées ensemble :

les retards sur les trains avec des [données de la SNCF](https://data.sncf.com/explore/?sort=modified) n’a pas été retenu car les données étant fournies sur la page du cours, il y avait un risque qu’un autre groupe choisisse le meme sujet

les satellites artificiels terrestres :
 * une base de donnée [ici](https://www.ucsusa.org/nuclear-weapons/space-weapons/satellite-database#.WlT6DSNejq1)
 * quelques data visualization déjà existantes : 
   * [every active satellite orbiting earth](https://qz.com/296941/interactive-graphic-every-active-satellite-orbiting-earth/) par David Yanofsky et Tim Fernholz,  	
   * [stuff in space](https://qz.com/296941/interactive-graphic-every-active-satellite-orbiting-earth/) par James Yoder, 
	* [active orbital satellites](https://www.behance.net/gallery/33677718/Active-Satellites-Poster) par Karl Engebretson
	* [space junk](https://public.tableau.com/views/Satellites_0/Satellites?:embed=y&:display_count=yes&:showVizHome=no) par Ken Flerlage

## 23 novembre 2017

Nous nous sommes intéressé à trouver une problématique non explorée avec le jeu de données sur les satellites :
 * visualiser la saturation des différentes orbites (orbites basses, orbites mediums et orbites géostationnaires) au cours des années.
 Le problème est que le jeu de données indique seulement les dates de lancements et les dates de fins de services or de nombreux satellites sont maintenus en orbite mais s’ils ne sont plus en service.

-> recherche d’un autre jeu de données comprenant les dates de sorties d’orbites.

## 27 novembre 2017

pas d’autre jeu de données sur les satellites en open access. Pas non plus d’autres idées d’axes d’intérêt qui n’a pas déjà été exploité dans les data visualisation existantes.
Une autre idée  : le transport de marchandises.
Visualiser les transports de marchandises est particulièrement intéressant car cela peut apporter de nombreuses informations économiques (exporter est un signe de richesses, le types de marchandises exportées est encore plus révélateur) mais aussi politiques (relations entre les pays, politique d’autosuffisance) 
 * une large base de données de transports de fret en Europe : EuropaStat

Au sein de l’UE le mode de transport routier est le plus utilisé, nous décidons donc d’utiliser le jeu de données suivant : 
	[Road freight transport by type of goods](ec.europa.eu/eurostat/statistics-explained/index.php/Road_freight_transport_by_type_of_goods)

Nous nous sommes décidé sur deux aspects importants dans la visualisation que nous voulons proposer : la dimension spatiale (les contraintes géographiques ont-elles un impact majeur ?) et la dimension temporelle (des changements significatifs seront-ils observables au cours du temps ? Sera t-on en mesure de voir des changements suite à des décisions politiques)
remarque : Nous aurions beaucoup aimé s’intéresser à l’influence du Brexit (juin 2016) par exemple malheureusement les données s’arrêtent en 2016. Il existe peut etre d’autres événements politiques moins médiatisés qui ont eu lieu au sein de l’UE entre 2008 et 2016.

## 28 novembre 2017

Nous nous rencontrons pour mettre en commun ce que nous avons trouvé chacun de notre coté et pour se mettre d’accord sur les idées à garder. 
Suite à cela nous rédigeons l’article intermédiaire à rendre le jour même.
Nous avons choisis de representer les exports (et les imports séparément) par des flèches proportionnelles à la quantité de marchandises (toutes categories de marchandises confondues). 
Le nombre de pays étant limité, la représentation devrait restée lisible.

img

Nous voulons pouvoir offrir néanmoins à l’utilisateur plus d’informations détaillées sur le types de marchandises pour cela nous proposons l’affichage un treemap lorsque l’utilisateur clique sur un pays spécifique.

## 30 novembre 2017

## 5 décembre 2017

Lecture du peer review du groupe qui à lu notre article intermédiaire.
Entretient avec l’encadrant référent qui nous a suggéré d'utiliser :
 - une grid map pour la representation géographique étant donnée que ni la superficie ni la géographie détaillée des pays n’est  important dans notre contexte.
 - les OD maps (avec un grid map dans chaque carré correspondant à un pays) créant ainsi des motifs caractéristiques et où les differences/similitudes entre chaque pays sera rapidement identifiable.

## 12 décembre 2017

recherche pour comment faire des gridmaps et des OD maps en D3.
 - un exemple de blocks pour la carte des etat unis : [US Grid Map](bl.ocks.org/kristw/2f628465e36f9821325d)
 - la librairie [geo2rect](https://github.com/sebastian-meier/d3.geo2rect) permet de réaliser facilement une gridmaps avec une transition vers la carte géographique classique à partir d’un fichier json.
 - la librairie [d3.layout.odmap](https://github.com/sebastian-meier/d3.geo2rect) pour faire facilement des od maps
 
 ## 21 décembre 2017
 
Nous avons mis en place la gridmap pour l’Europe avec geo2rect sur notre Github.
Nous nous sommes mis d’accord pour la répartition du travail que nous avons séparer en 3 :
 1. transformation des données pour avoir des fichiers json plus facilement utilisable en D3
 2. liaison des données  json à la gridmap + mise en forme des options à sélectionner pour l’utilisateur
 3. mise en place du od map


## 29 décembre 2017

Les fichiers json sont prets à être utilisé


## 3 janvier 2017

les données sont liées à la grid map et un bandeau sur le coté permet désormais à l’utilisateur de changer l’année, le type de marchandise et s’il s’agit des exports ou imports.


## 7 janvier 2017

la OD maps est mise en place


## 10 janvier 2017

Nous nous somme rencontrés pour préparer la soutenance.

## 11 janvier 2017

Soutenance

## 12 janvier 2017

Rendu de l'article final


