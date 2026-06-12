export const SS_BENCHES = [
  { id:'b1', name:'Banc du parc Monceau', area:'Parc Monceau · Paris 8e', lat:48.8797, lng:2.3089, x:35, y:26, score:4.3, count:28,
    status:{tone:'green',label:'Propre'},
    tags:[{icon:'trees',label:'Ombragé'},{icon:'sandwich',label:'Pique-nique'},{icon:'eye',label:'Belle vue'}],
    distance:'120 m', intents:['picnic','view','calm'], photos:3,
    reviews:[
      {name:'Léa Moreau',score:5,date:'il y a 3 j',text:"Parfait pour un pique-nique au calme, bien à l'ombre l'après-midi 🌳"},
      {name:'Tom B.',score:4,date:'il y a 1 sem',text:'Vue sympa sur le parc, un peu de passage le week-end mais rien de gênant.'},
      {name:'Inès K.',score:4,date:'il y a 2 sem',text:'Propre et tranquille en semaine. Idéal pour réviser dehors.'},
    ]},
  { id:'b2', name:'Banc des quais', area:'Quai de Seine · Paris 4e', lat:48.8534, lng:2.3520, x:52, y:56, score:4.7, count:51,
    status:{tone:'gold',label:'Top noté'},
    tags:[{icon:'sun',label:'Ensoleillé'},{icon:'eye',label:'Vue Seine'}],
    distance:'340 m', intents:['view','sun'], photos:5,
    reviews:[
      {name:'Naïm R.',score:5,date:'hier',text:'La vue sur la Seine au coucher du soleil, imbattable 🌇'},
      {name:'Clara D.',score:5,date:'il y a 4 j',text:'Mon spot préféré pour traîner avec les potes après les cours.'},
    ]},
  { id:'b3', name:'Banc square Louise', area:'Square Louise Michel · 18e', lat:48.8867, lng:2.3432, x:49, y:18, score:3.8, count:12,
    status:{tone:'green',label:'Calme'},
    tags:[{icon:'leaf',label:'Au calme'},{icon:'trees',label:'Verdure'}],
    distance:'600 m', intents:['calm'], photos:1,
    reviews:[
      {name:'Yanis',score:4,date:'il y a 5 j',text:'Tranquille, parfait pour lire. Un peu usé mais ça va.'},
      {name:'Manon',score:3,date:'il y a 3 sem',text:'Sympa mais parfois un peu de déchets le lundi matin.'},
    ]},
  { id:'b4', name:'Banc de la butte', area:'Parc de Belleville · 20e', lat:48.8686, lng:2.3826, x:65, y:38, score:4.5, count:34,
    status:{tone:'green',label:'Propre'},
    tags:[{icon:'eye',label:'Panorama'},{icon:'sun',label:'Coucher de soleil'}],
    distance:'1,2 km', intents:['view','sun'], photos:7,
    reviews:[
      {name:'Sofia',score:5,date:'il y a 2 j',text:'Le meilleur point de vue sur Paris, sans touristes 🙌'},
      {name:'Hugo',score:4,date:'il y a 1 sem',text:'Faut grimper un peu mais ça vaut le coup.'},
    ]},
  { id:'b5', name:'Allée des tilleuls', area:'Jardin du Luxembourg · 6e', lat:48.8462, lng:2.3372, x:46, y:64, score:4.1, count:19,
    status:{tone:'green',label:'Propre'},
    tags:[{icon:'trees',label:'Ombragé'},{icon:'leaf',label:'Au calme'}],
    distance:'850 m', intents:['calm','picnic'], photos:2,
    reviews:[
      {name:'Émile',score:4,date:'il y a 6 j',text:'Allée ombragée super agréable en été. Bancs en bon état.'},
    ]},
  { id:'b6', name:'Banc du Trocadéro', area:'Jardins du Trocadéro · 16e', lat:48.8614, lng:2.2883, x:26, y:47, score:null, count:0,
    status:{tone:'neutral',label:'Nouveau'},
    tags:[{icon:'eye',label:'Vue Tour Eiffel'}],
    distance:'2,1 km', intents:['view'], photos:0, reviews:[] },
];

export const SS_INTENTS = [
  { id:'picnic', icon:'sandwich',   label:'Pique-nique' },
  { id:'view',   icon:'mountain',   label:'Paysage'     },
  { id:'calm',   icon:'leaf',       label:'Au calme'    },
  { id:'sun',    icon:'sun',        label:'Ensoleillé'  },
  { id:'rated',  icon:'star',       label:'Déjà noté'   },
  { id:'near',   icon:'navigation', label:'Le + proche' },
];

export const SS_RTAGS = ['Ombragé','Ensoleillé','Vue agréable','Au calme','Bruyant','Propre','Sale','Dossier confortable','Accessible PMR','Proche transports','Vue sur eau','Vue sur parc'];

export const SS_USER = { name:'Alex Martin', pseudo:'alexm', benchCount:3, reviewCount:12 };
