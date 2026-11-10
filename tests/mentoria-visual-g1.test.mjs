import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const landing = fs.readFileSync("src/routes/MentoriaLanding.tsx", "utf8");
const styles = fs.readFileSync("src/routes/MentoriaLanding.css", "utf8");
const html = fs.readFileSync("index.html", "utf8");
const photoPath = path.join("public", "assets", "mentoria", "daniel-graebin-retrato.jpg");

test("retrato do mentor ocupa o núcleo, mantendo os três valores da mentoria", () => {
  assert.match(landing, /dg-mentoria__art-core--portrait/);
  assert.match(landing, /src="\/assets\/mentoria\/daniel-graebin-retrato\.jpg"/);
  assert.match(landing, /alt="Daniel Graebin, mentor/);
  assert.doesNotMatch(landing, /dg-mentoria__art-monogram/);
  for (const label of ["Estratégia", "Segurança", "Resultado"]) {
    assert.ok(landing.includes(label), label);
  }
  assert.match(styles, /object-fit: cover/);
  assert.match(styles, /max-width: 620px/);
});

test("foto fornecida é JPEG real e permanece em caminho público", () => {
  const data = fs.readFileSync(photoPath);
  assert.ok(data.length > 5_000);
  assert.deepEqual([...data.subarray(0, 3)], [0xff, 0xd8, 0xff]);
});

test("página pública tem identidade e canonical exclusivos da mentoria", () => {
  assert.match(html, /<title>Mentoria IA para Negócios \| Daniel Graebin<\/title>/);
  assert.match(html, /rel="canonical" href="https:\/\/mentoria-frontend-production\.up\.railway\.app\/"/);
  assert.doesNotMatch(html, /plataforma-efata-777-frontend-production\.up\.railway\.app/);
  assert.match(html, /<script src="\/env\.js"><\/script>/);
  assert.match(html, /<script type="module" src="\/src\/main\.tsx"><\/script>/);
});

test("não remove agente, workshop, portal nem introduz cobrança de fachada", () => {
  assert.match(landing, /import MentoriaAssistant from "\.\/MentoriaAssistant"/);
  assert.match(landing, /<MentoriaAssistant \/>/);
  assert.match(landing, /<WorkshopRegistrationForm \/>/);
  assert.match(landing, /<Link to="\/mentoria\/area">Área do mentorado<\/Link>/);
  assert.doesNotMatch(landing, /checkout_id|payment_approved|paid: true|tenant_id|role_id/);
});
