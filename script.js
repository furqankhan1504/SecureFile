// ===== PARTICLES =====
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 1.5 + 0.5;
    this.speedX = (Math.random() - 0.5) * 0.3;
    this.speedY = (Math.random() - 0.5) * 0.3;
    this.opacity = Math.random() * 0.5 + 0.1;
    this.pulse = Math.random() * Math.PI * 2;
    this.pulseSpeed = Math.random() * 0.02 + 0.01;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.pulse += this.pulseSpeed;
    if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
      this.reset();
    }
  }

  draw() {
    const currentOpacity = this.opacity * (0.5 + Math.sin(this.pulse) * 0.5);
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(99, 102, 241, ${currentOpacity})`;
    ctx.fill();
  }
}

for (let i = 0; i < 80; i++) {
  particles.push(new Particle());
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach((p) => {
    p.update();
    p.draw();
  });

  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(99, 102, 241, ${0.03 * (1 - dist / 120)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(animateParticles);
}
animateParticles();


// ===== CRYPTO LOGIC =====

let mode = "encrypt";

async function getKey(password, salt, usage) {
  const enc = new TextEncoder();

  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );

  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 100000,
      hash: "SHA-256"
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    [usage]
  );
}

async function encryptFile(file, password) {
  const data = await file.arrayBuffer();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const salt = crypto.getRandomValues(new Uint8Array(16));

  const key = await getKey(password, salt, "encrypt");

  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv: iv },
    key,
    data
  );

  const combined = new Uint8Array(salt.length + iv.length + encrypted.byteLength);
  combined.set(salt, 0);
  combined.set(iv, salt.length);
  combined.set(new Uint8Array(encrypted), salt.length + iv.length);

  return combined;
}

async function decryptFile(file, password) {
  const data = new Uint8Array(await file.arrayBuffer());

  const salt = data.slice(0, 16);
  const iv = data.slice(16, 28);
  const encrypted = data.slice(28);

  const key = await getKey(password, salt, "decrypt");

  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: iv },
    key,
    encrypted
  );

  return decrypted;
}

function download(data, filename) {
  const blob = new Blob([data]);
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();

  URL.revokeObjectURL(url);
}


// ===== RESET FORM =====

function resetForm() {
  $("#fileInput").val('');
  $("#fileInfo").removeClass('show');
  $("#fileDropZone").removeClass('has-file');

  $("#password").val('').attr('type', 'password');

  $("#eyeIcon").html(
    '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>' +
    '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>'
  );

  $("#strengthFill").css({ width: '0%', background: 'transparent', boxShadow: 'none' });
  $("#strengthText").text('');

  $("#status").text('').removeClass('success error');
}


// ===== MODE TOGGLE =====

function setMode(newMode) {
  mode = newMode;

  if (mode === "encrypt") {
    $("#slider").css("left", "4px");
    $("#encryptTab").addClass("active");
    $("#decryptTab").removeClass("active");
    $("#actionBtn").removeClass("decrypt-mode");
    $("#strengthWrapper").show();
    $("#passwordLabel").text("ENCRYPTION KEY");
    $("#password").attr("placeholder", "Enter your password");
    $("#btnContent").html(`<span class="flex items-center justify-center gap-2">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
      Encrypt File
    </span>`);
  } else {
    $("#slider").css("left", "calc(50%)");
    $("#decryptTab").addClass("active");
    $("#encryptTab").removeClass("active");
    $("#actionBtn").addClass("decrypt-mode");
    $("#strengthWrapper").hide();
    $("#passwordLabel").text("DECRYPTION KEY");
    $("#password").attr("placeholder", "Enter your password to decrypt");
    $("#btnContent").html(`<span class="flex items-center justify-center gap-2">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"/></svg>
      Decrypt File
    </span>`);
  }
}

$("#encryptTab").click(function () {
  setMode("encrypt");
  resetForm();
});

$("#decryptTab").click(function () {
  setMode("decrypt");
  resetForm();
});


// ===== FILE HANDLING =====

function formatSize(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

function showFileInfo(file) {
  $("#fileName").text(file.name);
  $("#fileSize").text(formatSize(file.size));
  $("#fileInfo").addClass('show');
  $("#fileDropZone").addClass('has-file');
}

// Stop click from bubbling back into drop zone
$("#fileInput").click(function (e) {
  e.stopPropagation();
});

// Click drop zone to open file browser
$("#fileDropZone").click(function (e) {
  if ($(e.target).closest('#removeFile').length) return;
  $("#fileInput").trigger('click');
});

$("#fileInput").change(function () {
  if (this.files.length) showFileInfo(this.files[0]);
});

$("#removeFile").click(function (e) {
  e.stopPropagation();
  e.preventDefault();
  $("#fileInput").val('');
  $("#fileInfo").removeClass('show');
  $("#fileDropZone").removeClass('has-file');
});

// Drag and drop
$("#fileDropZone").on('dragover', function (e) {
  e.preventDefault();
  $(this).addClass('drag-over');
});

$("#fileDropZone").on('dragleave', function () {
  $(this).removeClass('drag-over');
});

$("#fileDropZone").on('drop', function (e) {
  e.preventDefault();
  $(this).removeClass('drag-over');
  const files = e.originalEvent.dataTransfer.files;
  if (files.length) {
    $("#fileInput")[0].files = files;
    showFileInfo(files[0]);
  }
});


// ===== PASSWORD STRENGTH (encrypt mode only) =====

$("#password").on('input', function () {
  if (mode === "decrypt") return;

  const val = $(this).val();
  let score = 0;
  if (val.length >= 6) score++;
  if (val.length >= 10) score++;
  if (/[A-Z]/.test(val) && /[a-z]/.test(val)) score++;
  if (/[0-9]/.test(val)) score++;
  if (/[^A-Za-z0-9]/.test(val)) score++;

  const levels = [
    { width: '0%', color: 'transparent', text: '' },
    { width: '20%', color: '#ef4444', text: 'Very weak' },
    { width: '40%', color: '#f97316', text: 'Weak' },
    { width: '60%', color: '#eab308', text: 'Fair' },
    { width: '80%', color: '#22c55e', text: 'Strong' },
    { width: '100%', color: '#06b6d4', text: 'Very strong' },
  ];

  const level = val.length === 0 ? levels[0] : levels[Math.min(score, 5)];
  $("#strengthFill").css({
    width: level.width,
    background: level.color,
    boxShadow: level.color !== 'transparent' ? `0 0 10px ${level.color}40` : 'none'
  });
  $("#strengthText").text(level.text).css('color', level.color);
});


// ===== TOGGLE PASSWORD VISIBILITY =====

$("#togglePassword").click(function () {
  const input = $("#password");
  const isPassword = input.attr('type') === 'password';
  input.attr('type', isPassword ? 'text' : 'password');

  $("#eyeIcon").html(isPassword
    ? '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.05 6.05m3.828 3.828L6.05 6.05M6.05 6.05L3 3m6.878 6.879L21 21"/>'
    : '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>'
  );
});


// ===== ACTION BUTTON =====

function shakeButton() {
  $("#actionBtn").css('animation', 'shake 0.5s ease-in-out');
  setTimeout(() => {
    $("#actionBtn").css('animation', '');
  }, 500);
}

$('<style>@keyframes shake{0%,100%{transform:translateX(0)}10%,50%,90%{transform:translateX(-4px)}30%,70%{transform:translateX(4px)}}</style>').appendTo('head');

$("#actionBtn").click(async function () {
  const file = $("#fileInput")[0].files[0];
  const password = $("#password").val();

  if (!file) {
    $("#status").text("⚠️ Please select a file").removeClass('success').addClass('error');
    shakeButton();
    return;
  }
  if (!password) {
    $("#status").text("⚠️ Please enter a password").removeClass('success').addClass('error');
    shakeButton();
    return;
  }

  const modeText = mode === "encrypt" ? "Encrypting" : "Decrypting";
  $("#actionBtn").addClass('processing');
  $("#btnContent").html(`<span class="flex items-center justify-center"><span class="spinner"></span>${modeText}...</span>`);
  $("#status").text('').removeClass('success error');

  try {
    if (mode === "encrypt") {
      const encrypted = await encryptFile(file, password);
      download(encrypted, file.name + ".enc");

      $("#status").text("✅ File encrypted & downloaded!").removeClass('error').addClass('success');
    } else {
      const decrypted = await decryptFile(file, password);
      download(decrypted, file.name.replace(".enc", ""));

      $("#status").text("✅ File decrypted & downloaded!").removeClass('error').addClass('success');
    }

    setTimeout(() => {
      resetForm();
    }, 2000);

  } catch (e) {
    console.error(e);
    if (mode === "decrypt") {
      $("#status").text("❌ Wrong password or corrupted file").removeClass('success').addClass('error');
    } else {
      $("#status").text("❌ Encryption failed — please try again").removeClass('success').addClass('error');
    }
  }

  $("#actionBtn").removeClass('processing');
  setMode(mode);
});