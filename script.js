(function () {
  // Fallback used if answers.json can't be loaded (for example, opening index.html straight from disk).
  var answers = [
    "It is certain", "It is decidedly so", "Without a doubt", "Yes, definitely", "You may rely on it",
    "As I see it, yes", "Most likely", "Outlook good", "Yes", "Signs point to yes",
    "Reply hazy, try again", "Ask again later", "Better not tell you now", "Cannot predict now",
    "Concentrate and ask again", "Don\u2019t count on it", "My reply is no", "My sources say no",
    "Outlook not so good", "Very doubtful"
  ];

  var ball = document.getElementById("ball"), go = document.getElementById("go"), q = document.getElementById("q"),
      ans = document.getElementById("answer"), asked = document.getElementById("asked"), hint = document.getElementById("hint"),
      list = document.getElementById("list"), empty = document.getElementById("empty");
  var busy = false, history = [], last = -1;
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  fetch("answers.json")
    .then(function (r) { return r.json(); })
    .then(function (data) { answers = data.answers.map(function (a) { return a.text; }); })
    .catch(function () { /* keep fallback answers */ });

  function pick() {
    var i;
    do { i = Math.floor(Math.random() * answers.length); } while (i === last && answers.length > 1);
    last = i;
    return answers[i];
  }

  function render() {
    list.innerHTML = "";
    history.forEach(function (h) {
      var li = document.createElement("li");
      var left = document.createElement("small"); left.textContent = h.q || "(no question)";
      var right = document.createElement("b"); right.textContent = h.a;
      li.appendChild(left); li.appendChild(right); list.appendChild(li);
    });
    empty.style.display = history.length ? "none" : "block";
  }

  function shake() {
    if (busy) return;
    busy = true;
    var question = q.value.trim();
    ball.classList.remove("revealed", "shake");
    void ball.offsetWidth;
    ball.classList.add("shake");
    hint.textContent = "Shaking\u2026";
    asked.textContent = question;
    var result = pick();
    setTimeout(function () {
      ans.textContent = result;
      ball.classList.add("revealed");
      hint.textContent = "Shake again for a new answer.";
      history.unshift({ q: question, a: result });
      history = history.slice(0, 5);
      render();
      busy = false;
    }, reduce ? 150 : 900);
  }

  ball.addEventListener("click", shake);
  go.addEventListener("click", shake);
  q.addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); shake(); } });
  render();
})();
