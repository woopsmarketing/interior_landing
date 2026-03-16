// scripts/generate-vapid-keys.js
// VAPID 키 생성 스크립트 — Node.js로 직접 실행
// 사용법: node scripts/generate-vapid-keys.js
//
// 출력된 내용을 .env.local에 붙여넣으세요.

'use strict';

const webpush = require('web-push');

const keys = webpush.generateVAPIDKeys();

console.log('');
console.log('# ─────────────────────────────────────────');
console.log('# .env.local 에 아래 내용을 붙여넣으세요');
console.log('# ─────────────────────────────────────────');
console.log('');
console.log(`NEXT_PUBLIC_VAPID_PUBLIC_KEY=${keys.publicKey}`);
console.log(`VAPID_PRIVATE_KEY=${keys.privateKey}`);
console.log('VAPID_SUBJECT=mailto:admin@example.com');
console.log('');
console.log('# VAPID_SUBJECT 값을 실제 관리자 이메일로 교체하세요.');
console.log('# 키를 재생성하면 기존 구독자들의 푸시가 만료되므로');
console.log('# 운영 환경에서는 키를 변경하지 마세요.');
console.log('');
