(function () {
    var root = document.documentElement;
    var nav = document.getElementById("nav");
    var toggle = document.getElementById("navToggle");
    var panel = document.getElementById("navPanel");
    var progress = document.getElementById("progress");
    var year = document.getElementById("year");
    var form = document.getElementById("contactForm");
    var note = document.getElementById("formNote");
    var empty = document.getElementById("empty");

    if (year) year.textContent = String(new Date().getFullYear());

    function setTheme(theme) {
        root.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
        var color = document.querySelector('meta[name="theme-color"]');
        if (color) color.setAttribute("content", theme === "dark" ? "#090b10" : "#f4f6f8");
    }

    function setLang(lang) {
        root.lang = lang;
        localStorage.setItem("lang", lang);
        document.title = lang === "en"
            ? "Kemal Alper Akdeniz — Front-end developer"
            : "Kemal Alper Akdeniz — Front-end geliştirici";
    }

    document.getElementById("themeBtn").addEventListener("click", function () {
        setTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark");
    });

    document.getElementById("langBtn").addEventListener("click", function () {
        setLang(root.lang === "en" ? "tr" : "en");
    });

    function closeMenu() {
        panel.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
    }

    toggle.addEventListener("click", function () {
        var open = !panel.classList.contains("open");
        panel.classList.toggle("open", open);
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    panel.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", closeMenu);
    });

    var sections = Array.prototype.slice.call(document.querySelectorAll("main section[id]"));
    var links = Array.prototype.slice.call(document.querySelectorAll(".nav-links a, .rail a"));

    function onScroll() {
        var y = window.scrollY || document.documentElement.scrollTop;
        nav.classList.toggle("stuck", y > 12);
        var height = document.documentElement.scrollHeight - window.innerHeight;
        progress.style.transform = "scaleX(" + (height > 0 ? y / height : 0) + ")";

        var current = sections[0] && sections[0].id;
        sections.forEach(function (section) {
            if (section.getBoundingClientRect().top < 140) current = section.id;
        });
        links.forEach(function (link) {
            link.classList.toggle("active", link.getAttribute("href") === "#" + current);
        });
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    document.querySelectorAll(".filters button").forEach(function (button) {
        button.addEventListener("click", function () {
            var filter = button.getAttribute("data-filter");
            document.querySelectorAll(".filters button").forEach(function (item) {
                item.classList.toggle("on", item === button);
            });
            var visible = 0;
            document.querySelectorAll("#archive article").forEach(function (article) {
                var show = filter === "all" || article.getAttribute("data-cat").split(" ").indexOf(filter) !== -1;
                article.hidden = !show;
                if (show) visible += 1;
            });
            empty.hidden = visible !== 0;
        });
    });

    form.addEventListener("submit", function (event) {
        event.preventDefault();
        var data = new FormData(form);
        var body = "İsim: " + data.get("name") + "\nE-posta: " + data.get("email") + "\n\n" + data.get("message");
        note.hidden = false;
        window.location.href = "mailto:alperkemalakdeniz@gmail.com?subject=" +
            encodeURIComponent(data.get("subject")) + "&body=" + encodeURIComponent(body);
    });

    var motionOk = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    document.querySelectorAll(".case, .path li, .edu article, .mosaic a, .skill-board article, .prose p, .hero-facts li").forEach(function (el, index) {
        el.classList.add("reveal");
        el.style.transitionDelay = Math.min(index % 6, 5) * 70 + "ms";
    });
    if (!motionOk || !("IntersectionObserver" in window)) {
        document.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("in"); });
    } else {
        var seen = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("in");
                    seen.unobserve(entry.target);
                }
            });
        }, { threshold: 0.16 });
        document.querySelectorAll(".reveal").forEach(function (el) { seen.observe(el); });
    }

    var out = document.getElementById("termOut");
    if (out && motionOk) {
        var script = root.lang === "en"
            ? ["$ whoami", "kemal alper akdeniz", "$ cat ships.txt", "akdeniz technology  ·  EKİPLEŞ  ·  servis pusulası", "$ mail", "alperkemalakdeniz@gmail.com"]
            : ["$ whoami", "kemal alper akdeniz", "$ cat urunler.txt", "akdeniz technology  ·  EKİPLEŞ  ·  servis pusulası", "$ mail", "alperkemalakdeniz@gmail.com"];
        var line = 0;
        var char = 0;
        var text = "";
        function typeLine() {
            if (line >= script.length) {
                out.innerHTML = text + '<i class="caret"></i>';
                return;
            }
            var current = script[line];
            if (char < current.length) {
                text += current.charAt(char);
                char += 1;
                out.innerHTML = text + '<i class="caret"></i>';
                setTimeout(typeLine, current.charAt(0) === "$" ? 28 : 18);
            } else {
                text += "\n";
                line += 1;
                char = 0;
                setTimeout(typeLine, 280);
            }
        }
        typeLine();
    } else if (out) {
        out.textContent = "kemal alper akdeniz\nEKİPLEŞ · Servis Pusulası\nalperkemalakdeniz@gmail.com";
    }

    var canvas = document.getElementById("net");
    if (canvas && motionOk) {
        var ctx = canvas.getContext("2d");
        var points = [];
        function sizeNet() {
            var rect = canvas.parentElement.getBoundingClientRect();
            canvas.width = rect.width * devicePixelRatio;
            canvas.height = rect.height * devicePixelRatio;
            ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
        }
        function seed() {
            points = [];
            var count = Math.min(48, Math.floor(canvas.clientWidth / 28));
            for (var i = 0; i < count; i += 1) {
                points.push({
                    x: Math.random() * canvas.clientWidth,
                    y: Math.random() * canvas.clientHeight,
                    vx: (Math.random() - 0.5) * 0.45,
                    vy: (Math.random() - 0.5) * 0.45
                });
            }
        }
        sizeNet();
        seed();
        window.addEventListener("resize", function () { sizeNet(); seed(); });
        function drawNet() {
            var w = canvas.clientWidth;
            var h = canvas.clientHeight;
            ctx.clearRect(0, 0, w, h);
            var dark = root.getAttribute("data-theme") === "dark";
            ctx.strokeStyle = dark ? "rgba(255,90,60,0.35)" : "rgba(255,59,31,0.28)";
            ctx.fillStyle = dark ? "rgba(76,141,255,0.9)" : "rgba(37,99,235,0.8)";
            points.forEach(function (p, index) {
                p.x += p.vx;
                p.y += p.vy;
                if (p.x < 0 || p.x > w) p.vx *= -1;
                if (p.y < 0 || p.y > h) p.vy *= -1;
                ctx.beginPath();
                ctx.arc(p.x, p.y, 1.6, 0, Math.PI * 2);
                ctx.fill();
                for (var j = index + 1; j < points.length; j += 1) {
                    var q = points[j];
                    var dist = Math.hypot(p.x - q.x, p.y - q.y);
                    if (dist < 140) {
                        ctx.globalAlpha = 1 - dist / 140;
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(q.x, q.y);
                        ctx.stroke();
                        ctx.globalAlpha = 1;
                    }
                }
            });
            requestAnimationFrame(drawNet);
        }
        drawNet();
    }

    var pointer = document.getElementById("cursor");
    if (pointer && motionOk && window.matchMedia("(pointer: fine)").matches) {
        window.addEventListener("pointermove", function (event) {
            pointer.style.left = event.clientX + "px";
            pointer.style.top = event.clientY + "px";
        });
    }

    document.querySelectorAll(".screen").forEach(function (card) {
        card.addEventListener("pointermove", function (event) {
            if (!motionOk) return;
            var box = card.getBoundingClientRect();
            var x = (event.clientX - box.left) / box.width - 0.5;
            var y = (event.clientY - box.top) / box.height - 0.5;
            card.style.transform = "perspective(900px) rotateY(" + (x * 7) + "deg) rotateX(" + (-y * 7) + "deg)";
        });
        card.addEventListener("pointerleave", function () {
            card.style.transform = "";
        });
    });

    var buildLog = document.getElementById("buildLog");
    var sbPos = document.getElementById("sbPos");
    if (buildLog && motionOk) {
        var builds = root.lang === "en"
            ? ["npm run dev", "compiling hikaye.tsx", "bundling isler.tsx", "ready · 2026"]
            : ["npm run dev", "hikaye.tsx derleniyor", "isler.tsx paketleniyor", "hazır · 2026"];
        var bi = 0;
        setInterval(function () {
            bi = (bi + 1) % builds.length;
            buildLog.textContent = builds[bi];
        }, 1600);
    }
    if (sbPos && motionOk) {
        window.addEventListener("pointermove", function (event) {
            sbPos.textContent = "Ln " + event.clientY + ", Col " + event.clientX;
        });
    }

    document.querySelectorAll("[data-count]").forEach(function (node) {
        var target = Number(node.getAttribute("data-count"));
        if (!motionOk) {
            node.textContent = String(target);
            return;
        }
        var start = 0;
        var step = function () {
            start += 1;
            node.textContent = String(start);
            if (start < target) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    });
})();
