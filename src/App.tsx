import { useEffect, useMemo, useState } from "react";
import classNames from 'classnames';
import './App.css';

// https://netrunnerdb.com/api/2.0/public/cycles
// ashes, gateway, update, borealis

const url = 'https://netrunnerdb.com/find/?q=c%3A26%7C30%7C31%7C32+d%3Ac&sort=set&view=list&_locale=en'
// s = ``
// var reg = new RegExp('https://netrunnerdb.com/en/card/([^/"]*)', "g") // 
// JSON.stringify(Array.from(s.matchAll(reg)).map(it => it[1]))
const cards: string[] = [
  ...JSON.parse("[\"26031\",\"26032\",\"26033\",\"26034\",\"26035\",\"26036\",\"26037\",\"26038\",\"26039\",\"26040\",\"26041\",\"26042\",\"26043\",\"26044\",\"26045\",\"26046\",\"26047\",\"26048\",\"26049\",\"26050\",\"26051\",\"26052\",\"26053\",\"26054\",\"26055\",\"26056\",\"26057\",\"26058\",\"26059\",\"26060\",\"26061\",\"26062\",\"26063\",\"26064\",\"26065\",\"33031\",\"33032\",\"33033\",\"33034\",\"33035\",\"33036\",\"33037\",\"33038\",\"33039\",\"33040\",\"33041\",\"33042\",\"33043\",\"33044\",\"33045\",\"33046\",\"33047\",\"33048\",\"33049\",\"33050\",\"33051\",\"33052\",\"33053\",\"33054\",\"33055\",\"33056\",\"33057\",\"33058\",\"33059\",\"33060\",\"33061\",\"33062\",\"33063\",\"33064\",\"33065\",\"33095\",\"33096\",\"33097\",\"33098\",\"33099\",\"33100\",\"33101\",\"33102\",\"33103\",\"33104\",\"33105\",\"33106\",\"33107\",\"33108\",\"33109\",\"33110\",\"33111\",\"33112\",\"33113\",\"33114\",\"33115\",\"33116\",\"33117\",\"33118\",\"33119\",\"33120\",\"33121\",\"33122\",\"33123\",\"33124\",\"33125\",\"33126\",\"33127\",\"33128\",\"30035\",\"30036\",\"30037\",\"30038\",\"30039\",\"30040\",\"30041\",\"30042\",\"30043\",\"30044\",\"30045\",\"30046\",\"30047\",\"30048\",\"30049\",\"30050\",\"30051\",\"30052\",\"30053\",\"30054\",\"30055\",\"30056\",\"30057\",\"30058\",\"30059\",\"30060\",\"30061\",\"30062\",\"30063\",\"30064\",\"30065\",\"30066\",\"30067\",\"30068\",\"30069\",\"30070\",\"30071\",\"30072\",\"30073\",\"30074\",\"30075\",\"30077\",\"31040\",\"31041\",\"31042\",\"31043\",\"31044\",\"31045\",\"31046\",\"31047\",\"31048\",\"31049\",\"31050\",\"31051\",\"31052\",\"31053\",\"31054\",\"31055\",\"31056\",\"31057\",\"31058\",\"31059\",\"31060\",\"31061\",\"31062\",\"31063\",\"31064\",\"31065\",\"31066\",\"31067\",\"31068\",\"31069\",\"31070\",\"31071\",\"31072\",\"31073\",\"31074\",\"31075\",\"31076\",\"31077\",\"31078\",\"31079\",\"31080\",\"31081\",\"31082\",\"26097\",\"26098\",\"26099\",\"26100\",\"26101\",\"26102\",\"26103\",\"26104\",\"26105\",\"26106\",\"26107\"]" ),
  ...JSON.parse("[\"26108\",\"26109\",\"26110\",\"26111\",\"26113\",\"26114\",\"26115\",\"26116\",\"26118\",\"26119\",\"26120\",\"26121\",\"26122\",\"26123\",\"26124\",\"26125\",\"26126\",\"26128\",\"26129\",\"26130\",\"27004\",\"27005\",\"27006\",\"27007\"]" ),
]

function getRandomCardId(): number {
  const len = cards.length;
  const idx = Math.floor(Math.random() * len);
  return Number(cards[idx]);
}



const options = [1, 2, 3]; // 0 = none
function App() {
  const [selected, setSelected] = useState<number>(0);
  const [deck, setDeck] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [deckHovered, setDeckHovered] = useState<number | null>(null);


  useEffect(() => {
    // if (deck.length < 5) {
      for( let i = 0; i< 8; i++) { // react double load
        putCardInDeck(getRandomCardId());
      }
    // }
  }, []);
  
  // pick 3 random ids
  const rands: number[] = useMemo(
    () => [getRandomCardId(), getRandomCardId(), getRandomCardId()]
  , [deck]);

  const putCardInDeck = (cardId: number) => {
      return fetch('https://netrunnerdb.com/api/2.0/public/card/' + cardId).then(html => {
        return html.json();
      }).then(json => {
        const data = json.data[0];
        const { text, stripped_text, title, stripped_title, type_code, faction_code } = data;
        setDeck(deck => [
          ...deck,
          {
            cardId,
            fetched: false,
            text,
            title,
            type_code,
            faction_code
          }
        ])
      });
  }

  const onClickCard = (i: number) => {
    if (i !== selected) setSelected(i);
    else {
      setSelected(0);
      
      const cardId = rands[i-1];
      setLoading(true);
      putCardInDeck(cardId).then(() => 
      setLoading(false)
                                 );
    }
  }

  const onExport = () => {
    // jinteki format: 3 Echo\n
    const cardCounts = {}
    deck.forEach(cardObject => {
      const { cardId, title } = cardObject;
      console.log({ cardObject });
      if (cardCounts[cardId]) {
        cardCounts[cardId] = { ...cardCounts[cardId], count: cardCounts[cardId].count + 1 };
      } else {
        cardCounts[cardId] = { title, count: 1 };
      }
      console.log(cardCounts);
    });
    const jnetFormat = Object.values(cardCounts).map(it => `${it.count} ${it.title}`).join('\n');
    console.log(Object.values(cardCounts).map(it => `${it.count} ${it.title}`));
    window.navigator.clipboard.writeText(jnetFormat);
    alert('pasted jnet into clipboard!');
  }

  return (
    <>
      <div>Double click to choose a card!</div>
      <div style={{ display: 'flex' }} onClick={() => setSelected(0)}>
        {options.map((it) => {
          return (
            <img
              key={it}
              className={classNames('card', (selected === it) ? 'cardSelected' : null)}
              src={`https://static.nrdbassets.com/v1/large/${rands[it - 1]}.jpg`}
              style={{ height: '100%', width: 'auto' }}
              onClick={(e) => { onClickCard(it); e.stopPropagation(); }}
            >
            </img>
          );
        })
        }

      </div>
      <h3>
        <span>deck list: </span>
        <span><button onClick={onExport}>Export</button></span>
        
      </h3>
      <div style={{ display: 'flex' }}>
      <img 
        src={`https://static.nrdbassets.com/v1/large/${deckHovered || 26103}.jpg`}        
        style={{ height: 'auto', width: '450px', filter: deckHovered ? null : 'brightness(0) invert(1)'
               }}>
      </img>
      <div>
        {
          deck.map(cardObject => {
            const           {
            cardId,
            text,
            title,
            type_code,
            faction_code
          } = cardObject;

            return (
              <div key={cardId}>
                {cardId} - <span 
  style={{ textDecoration: 'underline', color: '#3366CC' }}
                             onPointerOver={() => { setDeckHovered(cardId) }}
                             onPointerOut={() => { }}
                             >{title}</span> - {text}
              </div>
            )
          })
        }
      </div>
      </div>
    </>
  )
}

export default App;