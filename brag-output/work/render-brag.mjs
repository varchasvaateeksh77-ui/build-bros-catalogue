import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { execSync } from 'node:child_process';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { chromium } = require('/usr/local/share/bun-global/node_modules/playwright-core');

const ROOT = '/app/applet';
const OUT_DIR = path.join(ROOT, 'brag-output');
const COMP_DIR = path.join(OUT_DIR, 'composition');
const WORK_DIR = path.join(OUT_DIR, 'work');
const FRAMES_DIR = path.join(WORK_DIR, 'frames');

const FPS = 30;
const DURATION = 20.2;
const TOTAL_FRAMES = Math.round(FPS * DURATION); // 606 frames

fs.mkdirSync(FRAMES_DIR, { recursive: true });

// Ensure three.core.js and three.module.js exist in COMP_DIR during render
for (const file of ['three.core.js', 'three.module.js']) {
  const src = path.join(ROOT, 'node_modules/three/build', file);
  const dst = path.join(COMP_DIR, file);
  if (!fs.existsSync(dst)) {
    fs.copyFileSync(src, dst);
  }
}

function startStaticServer(dir) {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const reqPath = req.url === '/' ? '/index.html' : req.url;
      const fullPath = path.join(dir, reqPath);
      if (!fs.existsSync(fullPath)) {
        res.writeHead(404);
        res.end('Not found');
        return;
      }
      const ext = path.extname(fullPath);
      const mime =
        ext === '.html'
          ? 'text/html'
          : ext === '.js'
          ? 'application/javascript'
          : 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': mime });
      fs.createReadStream(fullPath).pipe(res);
    });
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address();
      resolve({ server, url: `http://127.0.0.1:${port}/index.html` });
    });
  });
}

async function renderFrames() {
  const { server, url } = await startStaticServer(COMP_DIR);
  console.log(`Launching headless Chromium at 1080x1920 (9:16 Instagram Reels) on ${url}...`);

  const browser = await chromium.launch({
    headless: true,
    args: ['--use-gl=angle', '--use-angle=swiftshader', '--ignore-gpu-blocklist'],
  });
  const page = await browser.newPage({
    viewport: { width: 1080, height: 1920 },
    deviceScaleFactor: 1,
  });

  await page.goto(url, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForFunction(() => typeof window.renderAtTime === 'function');

  for (let i = 0; i < TOTAL_FRAMES; i++) {
    const t = i / FPS;
    await page.evaluate((timeSec) => {
      window.renderAtTime(timeSec);
    }, t);
    const framePath = path.join(FRAMES_DIR, `frame-${String(i).padStart(4, '0')}.jpg`);
    await page.screenshot({ path: framePath, type: 'jpeg', quality: 92 });
  }

  // Save settled poster frame (t = 14.5s -> frame 435: Level 3 3D + live 3-window sync)
  const posterSrc = path.join(FRAMES_DIR, `frame-${String(435).padStart(4, '0')}.jpg`);
  const posterDest = path.join(OUT_DIR, 'brag.jpg');
  fs.copyFileSync(posterSrc, posterDest);

  // Also save key inspection stills so we can visually verify scenes
  fs.copyFileSync(
    path.join(FRAMES_DIR, `frame-${String(45).padStart(4, '0')}.jpg`),
    path.join(WORK_DIR, 'still-s1.jpg')
  );
  fs.copyFileSync(
    path.join(FRAMES_DIR, `frame-${String(165).padStart(4, '0')}.jpg`),
    path.join(WORK_DIR, 'still-s2.jpg')
  );
  fs.copyFileSync(
    path.join(FRAMES_DIR, `frame-${String(255).padStart(4, '0')}.jpg`),
    path.join(WORK_DIR, 'still-s3a-wheel.jpg')
  );
  fs.copyFileSync(
    path.join(FRAMES_DIR, `frame-${String(310).padStart(4, '0')}.jpg`),
    path.join(WORK_DIR, 'still-s3b-waiter.jpg')
  );
  fs.copyFileSync(
    path.join(FRAMES_DIR, `frame-${String(570).padStart(4, '0')}.jpg`),
    path.join(WORK_DIR, 'still-s5-flip.jpg')
  );

  // Bake settled poster into frame 0 for Instagram/Reels/Slack/X thumbnails
  fs.copyFileSync(posterDest, path.join(FRAMES_DIR, 'frame-0000.jpg'));

  await browser.close();
  server.close();
  console.log('All 606 vertical 1080x1920 frames rendered!');
}

function buildAudioAndMux() {
  const sfxDir = path.join(ROOT, '.agents/skills/brag/assets/sfx');
  const musicPath = path.join(
    ROOT,
    '.agents/skills/brag/assets/music/happy-beats-business-moves-vol-10-by-ende-dot-app.mp3'
  );
  const mixedAudioPath = path.join(WORK_DIR, 'mixed-audio.m4a');
  const outputMp4 = path.join(OUT_DIR, 'brag.mp4');

  // Rich beat-synced SFX cues across all 5 scenes
  const sfxCues = [
    { file: 'impact/impactSoft_medium_001.ogg', delayMs: 180, vol: 0.45 },
    { file: 'impact/impactSoft_heavy_001.ogg', delayMs: 820, vol: 0.45 },
    { file: 'casino/card-slide-1.ogg', delayMs: 3550, vol: 0.42 },
    { file: 'interface/click_003.ogg', delayMs: 4950, vol: 0.44 },
    { file: 'interface/click_002.ogg', delayMs: 6350, vol: 0.44 },
    { file: 'casino/card-fan-2.ogg', delayMs: 7790, vol: 0.36 },
    { file: 'interface/click_005.ogg', delayMs: 9450, vol: 0.44 },
    { file: 'interface/bong_001.ogg', delayMs: 9650, vol: 0.48 },
    { file: 'impact/impactSoft_medium_002.ogg', delayMs: 11800, vol: 0.45 },
    { file: 'casino/card-slide-1.ogg', delayMs: 12100, vol: 0.36 },
    { file: 'casino/card-slide-8.ogg', delayMs: 12400, vol: 0.36 },
    { file: 'impact/impactBell_heavy_000.ogg', delayMs: 14200, vol: 0.42 },
    { file: 'impact/impactSoft_medium_004.ogg', delayMs: 16380, vol: 0.46 },
    { file: 'impact/impactSoft_medium_001.ogg', delayMs: 17300, vol: 0.45 },
    { file: 'impact/impactSoft_heavy_003.ogg', delayMs: 18400, vol: 0.48 },
  ];

  const inputs = [`-i "${musicPath}"`];
  const filterParts = [
    `[0:a]atrim=0:${DURATION},afade=t=in:st=0:d=0.3,afade=t=out:st=${(DURATION - 1.0).toFixed(2)}:d=1.0,volume=0.80[music]`,
  ];
  const mixLabels = ['[music]'];

  sfxCues.forEach((cue, idx) => {
    const inputIdx = idx + 1;
    inputs.push(`-i "${path.join(sfxDir, cue.file)}"`);
    const label = `[sfx${inputIdx}]`;
    filterParts.push(
      `[${inputIdx}:a]volume=${cue.vol},adelay=${cue.delayMs}|${cue.delayMs}${label}`
    );
    mixLabels.push(label);
  });

  filterParts.push(
    `${mixLabels.join('')}amix=inputs=${mixLabels.length}:duration=first:dropout_transition=0,alimiter=limit=0.95[aout]`
  );

  const audioCmd = `ffmpeg -y ${inputs.join(' ')} -filter_complex "${filterParts.join(';')}" -map "[aout]" -c:a aac -b:a 192k "${mixedAudioPath}"`;
  console.log('Mixing beat-synced soundtrack and Kenney SFX...');
  execSync(audioCmd, { stdio: 'inherit' });

  const videoCmd = `ffmpeg -y -framerate ${FPS} -i "${path.join(FRAMES_DIR, 'frame-%04d.jpg')}" -i "${mixedAudioPath}" -c:v libx264 -crf 18 -preset fast -pix_fmt yuv420p -c:a copy -shortest -movflags +faststart "${outputMp4}"`;
  console.log('Encoding final 1080x1920 (9:16 Instagram Reels) brag.mp4...');
  execSync(videoCmd, { stdio: 'inherit' });

  // Copy into public/media/ so the web preview can play and download it directly
  const publicMedia = path.join(ROOT, 'public/media');
  fs.mkdirSync(publicMedia, { recursive: true });
  fs.copyFileSync(outputMp4, path.join(publicMedia, 'brag.mp4'));
  fs.copyFileSync(path.join(OUT_DIR, 'brag.jpg'), path.join(publicMedia, 'brag.jpg'));

  // Clean up temporary frame JPEGs and copied Three.js bundles so repo stays lean
  fs.rmSync(FRAMES_DIR, { recursive: true, force: true });
  fs.rmSync(mixedAudioPath, { force: true });
  fs.rmSync(path.join(COMP_DIR, 'three.core.js'), { force: true });
  fs.rmSync(path.join(COMP_DIR, 'three.module.js'), { force: true });
  console.log('Done! Vertical 9:16 brag-output/brag.mp4 and brag-output/brag.jpg are ready.');
}

await renderFrames();
buildAudioAndMux();
