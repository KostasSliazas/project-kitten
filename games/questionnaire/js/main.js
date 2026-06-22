// jshint esversion:11
/* eslint camelcase: off */
(function (w, d) {
  'use strict';
  // variables
  const G = {
    URL: 'https://opentdb.com/api.php?amount=10',
    fdata: {}, // fetched data variable
    SECONDS: 20, // time for questions to answer
    elems: {}, // all elements get by ids loader, button, getMainDiv, getQuestio, getMessage, starBtn, star, stat, seco, imag
    quest: 0,
    score: 0,
  };
  const defaultData = {
    "response_code": 0,
 "results": [
   {
     "type": "multiple",
 "difficulty": "easy",
 "category": "Science",
 "question": "What planet is known as the Red Planet?",
 "correct_answer": "Mars",
 "incorrect_answers": ["Venus", "Jupiter", "Mercury"]
   },
 {
   "type": "multiple",
   "difficulty": "medium",
   "category": "History",
   "question": "In which year did the Berlin Wall fall?",
   "correct_answer": "1989",
   "incorrect_answers": ["1987", "1991", "1993"]
 },
 {
   "type": "multiple",
   "difficulty": "easy",
   "category": "General Knowledge",
   "question": "Which company created the iPhone?",
   "correct_answer": "Apple",
   "incorrect_answers": ["Samsung", "Microsoft", "Sony"]
 },
 {
   "type": "multiple",
   "difficulty": "hard",
   "category": "Geography",
   "question": "What is the capital city of Mongolia?",
   "correct_answer": "Ulaanbaatar",
   "incorrect_answers": ["Astana", "Bishkek", "Tashkent"]
 },
 {
   "type": "multiple",
   "difficulty": "medium",
   "category": "Entertainment: Video Games",
   "question": "Which company developed Minecraft?",
   "correct_answer": "Mojang",
   "incorrect_answers": ["Valve", "Epic Games", "Ubisoft"]
 },
 {
   "type": "multiple",
   "difficulty": "easy",
   "category": "Animals",
   "question": "What is the largest mammal on Earth?",
   "correct_answer": "Blue Whale",
   "incorrect_answers": ["African Elephant", "Giraffe", "Hippopotamus"]
 },
 {
   "type": "multiple",
   "difficulty": "medium",
   "category": "Computers",
   "question": "What does HTML stand for?",
   "correct_answer": "HyperText Markup Language",
   "incorrect_answers": [
     "HyperText Markdown Language",
     "HighText Machine Language",
     "Home Tool Markup Language"
   ]
 },
 {
   "type": "multiple",
   "difficulty": "hard",
   "category": "Space",
   "question": "Which moon of Saturn is larger than the planet Mercury?",
   "correct_answer": "Titan",
   "incorrect_answers": ["Europa", "Io", "Triton"]
 },
 {
   "type": "multiple",
   "difficulty": "easy",
   "category": "Sports",
   "question": "How many players are on the field for one soccer team during normal play?",
   "correct_answer": "11",
   "incorrect_answers": ["9", "10", "12"]
 },
 {
   "type": "multiple",
   "difficulty": "medium",
   "category": "Literature",
   "question": "Who wrote the novel '1984'?",
   "correct_answer": "George Orwell",
   "incorrect_answers": [
     "Aldous Huxley",
     "Ray Bradbury",
     "Ernest Hemingway"
   ]
 }
 ]
  }
  const SNDTRUE = new w.Audio('data:audio/mp3;base64,SUQzBABAAAAAIAAAAAwBIAUGXHIhTFRYWFgAAAAKAAAAU29mdHdhcmUA/+NIZAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAAMAAAMYAATExMTExMTE0BAQEBAQEBATExMTExMTExgYGBgYGBgYGBzc3Nzc3Nzc4aGhoaGhoaGk5OTk5OTk5OTpqampqampqa5ubm5ubm5ueDg4ODg4ODg4Pn5+fn5+fn5//////////8AAAA5TEFNRTMuMTAwAicAAAAAAAAAABQYJARFLgAAGAAADGChy0ixAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/+M4ZAAKhhNbLKCcAI8YAuMZQBAAC1rM0JBjxj4E8fkMYxvwLGPAMY37QAAAD//M//PP8wwz////qeeYYYY08+egiAsAYAwBgkEHqe7//////9/9v///9///Y8///3zx8biWTQbjcmeHs0TEzdU9E4lwfeXPv8H5cHwfwQ4DB8H35QEAQ+7EHlwQBAEPicEAQBAEP5cH+CDn//B9AgBD//////yhxVecu6nZvLu6pkRdJWXpUGgJ5hpoGAoWu2DxH+CCYILUUDHEyE+TOCUN43q0HPfhJ4tz/+N4RDIdnbdjjMzgADlS0r8ZmcABUUyajcgVnSuhlVQGQX2YP9HaJprTHUXa9U07Kk2HKBQM8DioCmZP1YWa0d9naex3LTl3Xeg1Q5oMOSiBarNIEbRgFVyQMF4FBkrmxoqo8sqdNMiGn+qNelVaeo8Ihe3jh3V3ueErnWWO0DWymRU2X7pr0RrJvg7Tr3P/88O282Mh1JD+vqzdLcpsu2bGsvyw3es61vKly7vd/mt///rX8/HeH5b5+8ua3vuXebv5Y9///meH/zerpdX60vVRkM71FQ8tLggOBsgHA1Q0K+RgbmQGOkpHEBxlGlm0A9OuyhXuHLxZAMQjPO87R23hm4yRsmmYt7KY6weibozBt1fSNgLWWmt0l7vROJFz0jsKOApDJ7kipIckM5G612BIHp95sjjcONVXrSSt15BRSfOZqZQFDMOvCxOidvKUQ/JYEgiCGuTsdws3LE8+M5l21QwDDL9AP7EZqXU3/Obstda6QIY7b738ZXSRmdhodfZn+6xs1dZVt446yy3jSWc///zxwz1/aX8/536vlbgwUCkgoFJBQKN77xUohTj//HmVFYUql3u3+zNwYeIJhOlo4bMUz0cmgaEtZJ9eTL58SKL3qSo8gltT99Jo26I7q0jNKF31OQ06rJQ+flRIMZndD0X//6u3/+MoREILQQl5LOMoARZqDvJZyTgC/WknA6wC44XEJ1mj+zY9zRZ5P/////3olu1v+zEw8xgzqIJtUt8+/s0hOSWtqZi2ECHZ1J9sxSyPvsrEsruOR48SOmqw8ed3o7LNlZxQwopU2ebbmsb//65n/8dBJ/L3f/iIgtgqG0SQ9MNyH////yt1mvu/+qEo6gli/+M4RAkLKQlvLCUKZxZSEup4SZQ6hPCcnFvcZV/JFlEBckUWl0yWmiFkiIiZATCp+zVyr4hmJknv/ZmaDvi5qO1JExrD+VU0Bm3////7WO/654ehr/JO/yU23VIA0G53/////3Iu2vaIdmJhyopjqZGAwWIYR/bUpmzit71QkwoggZQ4UbeHWy5Mzf9nG0uDfLUdpL+mpr0dYsE9Escaq0qrJ//u1VX/9zA3dvJNf/8AsQhc44FyUqz/////PIVOSS22gODljWhVgO4bdVueZxtbzE6XQ6sm/+M4RBkLaQlfLBlPaRZMEscYGWCZ5JJa0VWK6toY69n1Zed2TQjCoIcfI+ceAXGhMc1HPO///N6/9N0vS2ItzRHCyh+2pz9//ROtHCoJCIcfmf////96DiJmZvKpDcf/QphxCFq9XcML4bUSEeiuPwCFuKvfMql3yKhcqU7lV2oRRI6IgowwPEfQyf//rv19KtKcBBBWTd6vXrr1//b/a36lII77f9f/////////5dzKUltu0iDowDQtgFGgNY9l5KIx1sJgpWGoUisRC23PdCOjoKp9pTDf/+M4RCcKegljLhWilZWkDuJ8OAXD/o99BaY4UkF///9Xb+9aFEJMMj/3p////X/KU5SmMxDXP////////r//1GWabbeHh3YuGAaVKC4SzCDEjjVYd1nLbcaklOc4RBJCcaGEhQTQvn7dDjHRyJh+a/1e9DzDx841T1FJjfp//73T/1oFgSZP+tFS///Tzf9+6df9v///QCbqDklsupDsgAH4urLurqlysyrshIuQiiQGiBnUxq/+iel2R0DXJ1ARNIqylKoiAnWf///+31KrRqOh0HK0y+rJ/+MoZD8K2QdfLxRtgRT63sZeUAWCf+w/4lBFTyv/9ZCO+jSOUeYJQbVErg6hSS23bIDWAAeioN2R0+clfyp5MhjOpYlnOhrUf/827nMdeRO9DlZ0KHkLHmIoDp9////Q5Gb86+ggQO7/pRPuYGxBT3A10FtSk9gExmVoSz89WAj1BbgkkpDsgAHk5+hmbMpg/+M4ZA8KjQlVLwVtkRVSEsJeEFQ+2RBCH8ISyJzfXzvrv4n4QOa6HFIEw6lXO44///qWvupVVjrKBxE0lvcHngoed//iqgbd5X/lXMgXjSJEadeKTwlWGmxRycttu2Qu2AA+YUf73MJDKGmHzii8ffl2KEikYdZzWTI3aaRDEL4VjUT///3f/6UcEmfwVLCIxd1eSb0ILhP/1r6luvLoCoaMxGwiVGzQnEYVERISnVIAwBpQAPwAHcl///5///////7dYxq3///9ls6RkyJ4olgnjdAiJMES/+M4ZCgK9gk8L6DAAJaCLnBdQqAASATC5iKDQdFB/q7///+v1U0Vom06ePpb/Xf////S+3S93simy9FVJKp0VomsmUsoBACPAH8KGDDhNEM0syer/1Qj///////1dEY1af//9dJFlpJTIxRIYXiaKRcSHUOwbIBCQDhFxYhPhaOEVPTcaJ2I//8ERZK///z1R4XY1VC1pEQMucAg8HSVAAATky8TpOuJMwaJvRTtYUqOxHMcculGbTAzu8QGVtu8Z4cOBZqaqKjv3ssZ61ZtfnKautYfveF7/+NoZDkbHeEiDMfoADg7kkARmOABe6a3jrvbusabGr++4bvVL8ANSy7j3tJfrNGhXN85rWemfZd1zefZAzF3G/GgBiwIQzBZMRB43OQ3aeNrb5IZPCUAoUvJacMRau6L3uMu1GRFI54BFuD5NFZLSXod/Ddzv6r8sx7PCP/vlBr9fz4IsZ2b/e65ze+6pbuWO/3z8csfyuX+42u2s8MrF789/Z+au3q9LYxyz72xzPveaxxsZgAMSdugyRiUj6oPAUnqwxBzWoXAEnhF+lk0JjP0V2V2K+47cl3zsv+1d1STNmM4YyvuotSXqme8K+Wd7OrSZ1dXu73jbw5hy32/d23RV3dZZY1tdUcg/e9azs2NMay3T/PzFh4blxiIsFhYKmFzsc3a4BA6oa7iV66qSrxwAiIDA0NmqXANBNUTyxWEQ3DEdT8MAAgrCxyQojQkXwuF3pZllS54a/m+XL+Ud5hQ9/6HP//mLhz/5VPvV79uphLLtNhr+9/v5d//5+Wd7mOX9t9/Xfw59XO3fp8r1jadJAmPWUEAAQIBVESFYF3T41IjTv8JoLQ6Sr/qIso2/+NIZBoP8ZkWXMVQAB+TNkAJhZgCR//WxeuTKZFf//MDws4ehlifJYcknCDdf//ikhhgGBTcWgDDoACA4aCAKOFAh6Qs/rYySdSTo//i5h0kUJ0coiZAiPIiTJoXikVlsrX///5MmJOlJi8dSLpgXTJMvHTxic2NUxqgEAxxAO/4rT/iQiz/5kfMTEnTL/9AvFFyZKBdJr//ybIEWScICTBJDlEHGZ///xXRYRCYMhAKCAdsDT4D2QAzosQNgIeh7kyYstFkv/xBUTcLLEJh9jsFmkwO4corkFIaRFTorq///8hxwgxGpkVKBqTRNl4olwmTAtk0b/apTEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV/+MYZCcAAAGkAOAAAAAAA0gBwAAAVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV');
  const SNDFALSE = new w.Audio(
    'data:audio/mp3;base64,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Kyh8JnExjCD/IBELcdmYRCAt4igCggeCDiOYzruZJAC+2wAHBJ5oUDBlUEjxaYGKjih1QENmijUVNJucZFCYUY4wYuj9gyFmw3X0mazp9FfuM0DWsZtvw3O9IFo7nSJLeSeFCxLJh/Zai5zEiY1qFSSs+pfvz2h+taatj58e0pCnrbuIJQE2+4AT//uQZOMAAssuWfsPS7hQRrsfYYV3S6i5Zew8y2k8Gyz9gxXcbCFLCCAQUQoODgmE40QvqnImpOLVcSUW25MHJQLLpZQS7DAF5zcpl8ZO/yurrE7bdpOv29rNbr2NPM1gYeWe3Z1u0XNTd+rMMFI3Y72/GvaavTFkVocrtdhJHdIWJM5EEQT08dsvlC4MMJCiImPsZzSD8QgwsFDAsDA0w8JNhHjBBlI0xECCAMxooMqWEzDBRAwYsiOgZKWZZkmEMEDQBhM214yL4IP0007QO5AYOwRSwFEUqRIipjLvlTlNPa8leSAF8AwIDASXo6Fb1pLispiT/OA/Efjtt/kyYPgyG2JosxqUxmM481GoS9sdreumRsvL1N678Bdyy/dWM1XlnL////DTszcjr24cjFitTU1Wzjru///////+nt9w5+GHLeeWUqq0sprU1Ns7/AgYD+CADPwkDQlO//+jTBAxV0mmhUgAUQSP2ZrScAAAyI43YE+y8ONBUMHBjNwgM7ATc49JcwEHnXemwPm4lEGJPgAgg12C6JvLZwGa0mTC//uwRPaAAzA0WH1h4ApjRssfrDABHHk9R/m9AgLQHii/NaBBIQJRCMEg8ZeYUT6sBLDCzJ+3ahICIrNDhq81hsIao5cyxl69mHprqtLrpKiRiGZa+tWAmmStyICaK6sUVVFAKAxiEFNaqxmzWpt3YKkcqgCpFZA860Vbl2N/Kq1NKpThdp4VIuf//7JkwpJOYfz+fyVRSQ1QBgjAYCAgJ4KbFFZBX//nQn//+KyGBQ3EF6CuhHZEAQARHhKo9/+IlB1MQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/+xBE7Q/w8wJERwwACgugCIXgAAEAAAGkAAAAIAAANIAAAARVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVQ=='
  );
  d.addEventListener('DOMContentLoaded', init.bind(G, this));

  function init() {
    getData(); // get data from API
    const button = d.getElementById('starBtn');
    const getMainDiv = d.getElementById('main');
    const getQuestio = d.getElementById('ques');
    const getMessage = d.getElementById('mess');
    const starBtn = d.getElementById('starBtn');
    const star = d.getElementById('star');
    const stat = d.getElementById('usta');
    const scor = d.getElementById('usco');
    const seco = d.getElementById('seco');
    const imag = d.getElementById('imag');
    const loader = d.getElementById('loader');
    if (!w.navigator.vibrate) d.getElementById('vibr').parentElement.style.display = 'none';

    // loader (spiner) on init show counting percents
    for (let i = 0; i <= 100; i++) {
      (function (ind) {
        setTimeout(function () {
          loader.childNodes[2].nodeValue = ind + '%';
        }, 100 + 10 * ind);
      })(i);
    }
    Object.assign(G.elems, { scor, loader, button, getMainDiv, getQuestio, getMessage, starBtn, star, stat, seco, imag });
    G.elems.starBtn.removeEventListener('click', init);
  }

  function dataLoaded(data) {
    G.elems.getMessage.classList.remove('hide'); // always show div when init

    G.elems.star.innerText = '';
    G.fdata = data.results; // set data to (d = document) as global variable
    G.elems.loader.style.display = 'none'; // when loaded data hide loader (spiner)
    if (!readValue()[0]) {
      // read localStorage if there is none show message becouse it's string it will be NOT falsy
      G.elems.star.innerHTML = 'This game is using <a href="https://en.wikipedia.org/wiki/Web_storage#Local_and_session_storage" target="_blank" rel="noopener noreferrer">localStorage</a>.';
    } else {
      G.elems.star.innerHTML = 'Welcome back';
    }
    G.quest = Number(readValue()[0]) || 0;
    G.score = Number(readValue()[1]) || 0;
    checkIsAllAnswered();
    updateStat();
    G.elems.scor.innerText = G.score;
    G.elems.starBtn.innerText = G.quest > 0 ? 'continue' : 'start';
    G.elems.starBtn.addEventListener('click', start);
  }

  function getData() {
    w.fetch(G.URL)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Something went wrong');
      }
    })
    .then(responseJson => {
      dataLoaded(responseJson);
    })
    .catch(error => {
      dataLoaded(defaultData);
      G.elems.star.innerText = 'Error: ' + error;
      G.elems.starBtn.innerText = 'Retry with default';
      G.elems.getMessage.classList.remove('hide');
    });
  }

  function start() {
    hide.call(G.elems.getMessage); // hide message
    addQuestions();
    setTimeout(show, 300);
    updateStat();
    G.elems.scor.innerText = G.score;
  }

  function addQuestions() {
    clearTimeout(G.tim); // clear timout on click so it's freeze (stops) timer
    countdown(G.SECONDS);
    const { category, incorrect_answers, correct_answer, question } = G.fdata[G.quest]; // destructure variables
    const ins = getRandomIntInclusive(0, incorrect_answers.length); // real answer ID
    G.trueA = 'id' + ins; // the real answer variable
    const incorrect = [...incorrect_answers]; // copy new array of incorect
    incorrect.splice(ins, 0, correct_answer); // inject wit true answer incorect answer array
    const ans = [];
    for (let i = 0, len = incorrect.length; i < len; i++) {
      ans.push(new CreateElem('button', 'btn tips trans', 'id' + i, decodeEntities(incorrect[i])));
    }
    ans.map(el => G.elems.getMainDiv.appendChild(el));
    G.elems.imag.innerText = category; // category add
    const qu = new CreateElem('div', 'q', 'q', decodeEntities(question)); // questions adding
    G.elems.getQuestio.appendChild(qu);
    G.elems.getMainDiv.addEventListener('click', loopElems); // add event listener to answers
    w.setTimeout(() => {
      document.body.style.cursor = 'default';
      G.elems.getMainDiv.style.pointerEvents = 'auto';
    }, 1000);
  }

  // when clicked answer load this function
  function loopElems(elem) {
    // return false if not answer button
    if (!elem.target.classList.contains('tips')) return false;
    clearTimeout(G.tim);
    sele.call(elem.target); // add class user selected answer
    G.elems.getMainDiv.removeEventListener('click', loopElems); // remove event listener to answers

    const getAllansw = [...document.getElementsByClassName('tips')]; // loop elements and add classes
    getAllansw.forEach(element => {
      if (element.id !== G.trueA) {
        nno.call(element);
      } else {
        yyes.call(element);
      }
      element.disabled = true;
    });
    G.elems.getMainDiv.style.pointerEvents = 'none';
    document.body.style.cursor = 'wait';

    const answ = document.getElementById('id' + G.trueA);
    if (elem.target.id === G.trueA) {
      ++G.score;
      createItem(G.quest, G.score);
      sele.bind(answ);
      yyes.call(G.elems.getQuestio);
      if (checkIsChecked('vibr') && w.navigator.vibrate) w.navigator.vibrate([20, 60, 20]); // vibrate for true answer
      if (checkIsChecked('soun')) SNDTRUE.play();
    } else {
      nno.call(G.elems.getQuestio);
      nno.bind(answ);
      if (checkIsChecked('vibr') && w.navigator.vibrate) w.navigator.vibrate(60); // vibrate for wrong answer
      if (checkIsChecked('soun')) SNDFALSE.play();
    }
    nextQuest();
  }

  function checkIsAllAnswered() {
    if (G.quest >= G.fdata.length) {
      G.elems.star.innerText = 'Your score: ' + G.score + '/' + G.fdata.length;
      if (G.fdata.length === G.score) {
        G.elems.star.innerText += '\nvictory!';
        G.elems.starBtn.innerText = 'Repeat';
      } else {
        G.elems.starBtn.innerText = 'Improve';
      }
      // set reset all stuff
      createItem(0, 0);
      G.quest = 0;
      G.score = 0;
      document.body.style.cursor = 'default';
      G.elems.getMessage.classList.remove('hide');
      return true;
    }
    return false;
  }

  function nextQuest() {
    G.quest++; // increase questions
    createItem(G.quest, G.score);
    G.elems.scor.innerText = G.score;
    setTimeout(() => {
      if (checkIsAllAnswered()) {
        remElements('img');
        remElements('q');
        remElements('main');
        G.elems.getQuestio.className = 'bg';
        return false;
      } else {
        remElements('img');
        remElements('q');
        remElements('main');
        addQuestions();
        setTimeout(show, 300);
        updateStat();
        G.elems.getQuestio.className = 'bg';
      }
    }, 1100);
  }
  // remove elements
  function remElements(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
      if (element.children.length > 0) {
        element.innerHTML = '';
      } else {
        element.parentNode.removeChild(element);
      }
    }
  }
  // add class hide
  function hide() {
    const element = this;
    if (element && element.classList) {
      element.classList.add('hide');
    }
  }
  // add class selse
  function sele() {
    const element = this;
    if (element && element.classList) {
      element.classList.add('sele');
    }
  }
  // add class yyes
  function yyes() {
    const element = this;
    if (element && element.classList) {
      element.classList.add('yyes');
    }
  }
  // add class nno
  function nno() {
    const element = this;
    if (element && element.classList) {
      element.classList.add('nno');
    }
  }

  // Count time for one questions
  const countdown = seconds => {
    (function inner() {
      G.elems.seco.innerText = seconds;
      clearTimeout(G.tim);
      if (--seconds >= 0) {
        G.tim = setTimeout(inner, 1000);
      }
      if (seconds === -1) {
        G.elems.getMainDiv.removeEventListener('click', loopElems); // remove event listener to answers
        nextQuest();
      }
    })();
  };

  function CreateElem(e, className, id, text) {
    if (!(this instanceof CreateElem)) return new CreateElem(e, className, id);
    e = document.createElement(e);
    if (id) e.id = id;
    if (className) e.className = className;
    if (text) e.innerText = text;
    return e;
  }

  function show() {
    const elems = [...document.getElementsByClassName('tips')];
    for (let i = elems.length - 1; i >= 0; i--) {
      elems[i].classList.toggle('trans');
    }
  }

  // statistics for questions numbers
  function updateStat() {
    G.elems.stat.innerText = Number(G.quest) + 1 + '/' + G.fdata.length;
  }

  // helper function random for random stuff
  function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
  }

  // helper function to decodeEntities from stackoverflow.com
  const decodeEntities = (function () {
    // this prevents any overhead from creating the object each time
    const element = document.createElement('div');

    function decodeHTMLEntities(str) {
      if (str && typeof str === 'string') {
        // strip script/html tags
        str = str.replace(/<script[^>]*>([\S\s]*?)<\/script>/gim, '');
        str = str.replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gim, '');
        element.innerHTML = str;
        str = element.textContent;
        element.textContent = '';
      }

      return str;
    }

    return decodeHTMLEntities;
  })();
  // Local Storage create item
  function createItem(q, s) {
    if (storageAvailable('localStorage')) {
      w.localStorage.setItem('Game-guestionaire-question', q);
      w.localStorage.setItem('Game-guestionaire-score', s);
    } else {
      return false;
    }
  }
  // Local Storage read item
  function readValue() {
    if (storageAvailable('localStorage')) {
      const x = w.localStorage.getItem('Game-guestionaire-question');
      const a = w.localStorage.getItem('Game-guestionaire-score');
      return [x, a];
    } else {
      return false;
    }
  }
  // Local Storage is Available
  function storageAvailable(type) {
    try {
      const storage = w[type];
      const x = '__storage_test__';
      storage.setItem(x, x);
      storage.removeItem(x);
      return true;
    } catch (e) {
      return false;
    }
  }

  function checkIsChecked(id) {
    if (document.getElementById(id).checked) return true;
    return false;
  }
})(window, document);
