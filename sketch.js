/*
 * Video, Audio und dynamische Gesichtserfassung
 * 
 * Martin Wiesner remixed nach einer Version von Yuli Cai 蔡雨利 caiyuli.com
 */

// Beispiel 9-3: Gesichtsverfolgung und Emotionserkennung mit clmtrakr
// Weitere Informationen zu clmtrackr: https://github.com/auduno/clmtrackr

let ctracker;
let emotionData;
let ec; // Emotionserkennungs-Lokale Variable

function setup() {
  // Aktiviere die Kamera und erlaube dem Browser, die Kamera zu nutzen
  let videoInput = createCapture(VIDEO);
  videoInput.size(800, 600);
  videoInput.position(70, 150);

  // Canvas einrichten
  let cnv = createCanvas(800, 600);
  cnv.position(70, 150);

  // Einen lokalen Tracker erstellen
  ctracker = new clm.tracker();
  ctracker.init(pModel);
  ctracker.start(videoInput.elt);

  // Nutze die Funktionen der Bibliothek, um eine lokale Emotionsanalyse zu erhalten
  ec = new emotionClassifier();
  ec.init(emotionModel);
  emotionData = ec.getBlank();

  // Tabelle initialisieren
  table = createElement('table');
  table.position(500, 150);
  let header = createElement('thead');
  let row = createElement('tr');
  row.child(createElement('th', 'Zeit'));
  for (let emotion of emotionData) {
    row.child(createElement('th', emotion.emotion));
  }
  header.child(row);
  table.child(header);

  textSize(15);
  
}

function draw() {
  clear();
  let cp = ctracker.getCurrentParameters();
  let er = ec.meanPredict(cp);

  // Zeige die Emotionen über dem Videobild
  for (let i = 0; i < er.length; i++) {
    let emotion = er[i].emotion;
    let value = er[i].value;
    let barLength = value * 300; // Länge des Balkens basierend auf dem Emotionswert

    // Wähle die Farbe basierend auf der Emotion
    switch (emotion) {
      case 'angry':
        fill(255, 0, 0); // Rot
        break;
      case 'happy':
        fill(0, 255, 0); // Fröhliches Grün
        break;
      case 'scared':
        fill(128, 0, 128); // Lila
        break;
      case 'disgusted':
        fill(139, 69, 19); // Hässliches Braun
        break;
      case 'sad':
        fill(128, 128, 128); // Grau
        break;
      case 'fear':
        fill(0, 0, 139); // Dunkles Blau
        break;
      case 'surprised':
        fill(255, 215, 0); // Helles Gelb
        break;
      default:
        fill(200); // Grau für andere Emotionen
    }

    // Zeichne den Balken
    rect(20, (i + 1) * 30 - 10, barLength, 20);

    // Setze die Schriftfarbe auf Schwarz und zeichne den Text
    fill(0);
    noStroke();
    text(emotion + ' ' + nfc(value, 2), 20, (i + 1) * 30);
  }

  let row = createElement('tr');
  let timestamp = nf(hour(), 2) + ':' + nf(minute(), 2) + ':' + nf(second(), 2);
  row.child(createElement('td', timestamp));

  if (er && er.length > 0) {
    for (let emotion of emotionData) {
      let value = '';
      for (let detectedEmotion of er) {
        if (detectedEmotion.emotion === emotion.emotion) {
          value = nfc(detectedEmotion.value, 2);
          break;
        }
      }
      row.child(createElement('td', value));
    }
  }
  row.parent(table);
}
