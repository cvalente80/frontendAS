import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { collection, collectionGroup, getDocs, getFirestore, limit, query, where } from 'firebase/firestore';

const stamp = new Date().toISOString().replace(/[:.]/g, '-');
const dir = path.resolve(process.cwd(), 'artifacts', 'playwright-transfer', `zurich-auto-flow-${stamp}`);
await fs.mkdir(dir, { recursive: true });

const meta = { steps: [] };
const runStartedAt = Date.now();
const originalStepsPush = meta.steps.push.bind(meta.steps);
meta.steps.push = (...entries) => {
  const stampedEntries = entries.map((entry) => {
    if (typeof entry !== 'string') return entry;
    const elapsedMs = Date.now() - runStartedAt;
    return `t+${elapsedMs}ms | ${entry}`;
  });
  return originalStepsPush(...stampedEntries);
};
const debugOverlayEnabled = ['1', 'true', 'yes'].includes(String(process.env.TRANSFER_DEBUG_OVERLAY || 'false').trim().toLowerCase());
const sourcePreferenceRaw = String(process.env.TRANSFER_SOURCE_PREFERENCE || '').trim().toLowerCase();
const preferLocalhostFirst = sourcePreferenceRaw === 'localhost' || sourcePreferenceRaw === 'local' || sourcePreferenceRaw === 'localhost-first';
const headless = String(process.env.PW_HEADLESS || 'true').toLowerCase() !== 'false';
const slowMo = Number(process.env.PW_SLOW_MO || (headless ? 0 : 220));
const manualMatriculaCapture = ['1', 'true', 'yes'].includes(String(process.env.TRANSFER_MANUAL_MATRICULA_LUPA_CAPTURE || '').trim().toLowerCase());
const manualMatriculaAfterNif = ['1', 'true', 'yes'].includes(String(process.env.TRANSFER_MANUAL_MATRICULA_AFTER_NIF || '').trim().toLowerCase());
const manualSelectVehicleFirst = ['1', 'true', 'yes'].includes(String(process.env.TRANSFER_MANUAL_SELECT_VEHICLE_FIRST || '').trim().toLowerCase());
const manualSelectVehicleTimeoutMs = Math.max(10000, Number.parseInt(String(process.env.TRANSFER_MANUAL_SELECT_VEHICLE_TIMEOUT_MS || '240000'), 10) || 240000);
const manualSelectVehicleReopenAttempts = Math.max(0, Number.parseInt(String(process.env.TRANSFER_MANUAL_SELECT_REOPEN_ATTEMPTS || '4'), 10) || 4);
const manualSelectVehicleReopenWaitMs = Math.max(120, Number.parseInt(String(process.env.TRANSFER_MANUAL_SELECT_REOPEN_WAIT_MS || '220'), 10) || 220);
const manualSelectVehicleLateFieldWaitMs = Math.max(300, Number.parseInt(String(process.env.TRANSFER_MANUAL_SELECT_LATE_FIELD_WAIT_MS || '700'), 10) || 700);
const manualSelectVehicleInvisibleIdleMs = Math.max(350, Number.parseInt(String(process.env.TRANSFER_MANUAL_SELECT_INVISIBLE_IDLE_MS || '700'), 10) || 700);
const manualSelectVehicleAutoPickAfterMs = Math.max(1200, Number.parseInt(String(process.env.TRANSFER_MANUAL_SELECT_AUTOPICK_AFTER_MS || '3500'), 10) || 3500);
const manualLearnVehicleClick = ['1', 'true', 'yes'].includes(String(process.env.TRANSFER_MANUAL_LEARN_VEHICLE_CLICK || 'false').trim().toLowerCase());
const manualLearnCaptureWindowMs = Math.max(1200, Number.parseInt(String(process.env.TRANSFER_MANUAL_LEARN_CAPTURE_WINDOW_MS || '3200'), 10) || 3200);
const manualLearnSecondLupaRetryAttempts = Math.max(1, Number.parseInt(String(process.env.TRANSFER_MANUAL_LEARN_SECOND_RETRY_ATTEMPTS || '10'), 10) || 10);
const forceRecoveryReclickInAutoMode = ['1', 'true', 'yes'].includes(String(process.env.TRANSFER_FORCE_RECOVERY_RECLICK_ONCE || 'true').trim().toLowerCase());
const vehicleResultIndex = Math.max(0, Number.parseInt(String(process.env.TRANSFER_VEHICLE_RESULT_INDEX || '0'), 10) || 0);
const vehiclePreferredSelector = String(process.env.TRANSFER_VEHICLE_PREFERRED_SELECTOR || '').trim();
const pauseAfterAutoSelectVehicleMs = Math.max(0, Number.parseInt(String(process.env.TRANSFER_PAUSE_AFTER_AUTO_SELECT_VEHICLE_MS || '2500'), 10) || 2500);
const forcedMatriculaLupaSelector = String(process.env.TRANSFER_MATRICULA_LUPA_SELECTOR || '').trim();
const defaultMatriculaLupaSelector = 'div.WSearch.T3:nth-of-type(1) > div.Text_Note.OSInline:nth-of-type(2) > span.fa.fa-fw';
const effectiveMatriculaLupaSelector = forcedMatriculaLupaSelector || defaultMatriculaLupaSelector;
const matriculaLookupClicks = Math.max(1, Number.parseInt(String(process.env.TRANSFER_MATRICULA_LUPA_CLICKS || '2'), 10) || 2);
const matriculaFieldFocusClicks = Math.max(1, Number.parseInt(String(process.env.TRANSFER_MATRICULA_FOCUS_CLICKS || '3'), 10) || 3);
const matriculaFieldFocusClickGapMs = Math.max(0, Number.parseInt(String(process.env.TRANSFER_MATRICULA_FOCUS_CLICK_GAP_MS || '70'), 10) || 70);
const matriculaPreflightFocusClicks = Math.max(0, Number.parseInt(String(process.env.TRANSFER_MATRICULA_PREFLIGHT_FOCUS_CLICKS || '3'), 10) || 3);
const matriculaPreflightFocusGapMs = Math.max(0, Number.parseInt(String(process.env.TRANSFER_MATRICULA_PREFLIGHT_FOCUS_GAP_MS || '35'), 10) || 35);
const matriculaPostPreflightFocusClicks = Math.max(1, Number.parseInt(String(process.env.TRANSFER_MATRICULA_POST_PREFLIGHT_FOCUS_CLICKS || '1'), 10) || 1);
const matriculaPrimingEnabled = ['1', 'true', 'yes'].includes(String(process.env.TRANSFER_MATRICULA_PRIMING_ENABLED || 'true').trim().toLowerCase());
const matriculaPrimingFocusClicks = Math.max(1, Number.parseInt(String(process.env.TRANSFER_MATRICULA_PRIMING_FOCUS_CLICKS || '2'), 10) || 2);
const matriculaPrimingFocusGapMs = Math.max(0, Number.parseInt(String(process.env.TRANSFER_MATRICULA_PRIMING_FOCUS_GAP_MS || '20'), 10) || 20);
const matriculaPrimingClickTimeoutMs = Math.max(250, Number.parseInt(String(process.env.TRANSFER_MATRICULA_PRIMING_CLICK_TIMEOUT_MS || '700'), 10) || 700);
const matriculaCharTypeDelayMs = Math.max(0, Number.parseInt(String(process.env.TRANSFER_MATRICULA_TYPE_DELAY_MS || '90'), 10) || 90);
const matriculaInterCharPauseMs = Math.max(0, Number.parseInt(String(process.env.TRANSFER_MATRICULA_INTER_CHAR_PAUSE_MS || '40'), 10) || 40);
const matriculaPostTypePauseMs = Math.max(0, Number.parseInt(String(process.env.TRANSFER_MATRICULA_POST_TYPE_PAUSE_MS || '320'), 10) || 320);
const matriculaTabPauseMs = Math.max(0, Number.parseInt(String(process.env.TRANSFER_MATRICULA_TAB_PAUSE_MS || '260'), 10) || 260);
const matriculaShiftTabPauseMs = Math.max(0, Number.parseInt(String(process.env.TRANSFER_MATRICULA_SHIFT_TAB_PAUSE_MS || '220'), 10) || 220);
const matriculaEnterPauseMs = Math.max(0, Number.parseInt(String(process.env.TRANSFER_MATRICULA_ENTER_PAUSE_MS || '600'), 10) || 600);
const matriculaPostBlurPauseMs = Math.max(0, Number.parseInt(String(process.env.TRANSFER_MATRICULA_POST_BLUR_MS || '250'), 10) || 250);
const matriculaPreLookupPauseMs = Math.max(0, Number.parseInt(String(process.env.TRANSFER_MATRICULA_PRE_LOOKUP_MS || '250'), 10) || 250);
const matriculaLookupWaitFirstMs = Math.max(0, Number.parseInt(String(process.env.TRANSFER_MATRICULA_LOOKUP_WAIT_FIRST_MS || '250'), 10) || 250);
const matriculaLookupWaitRetryMs = Math.max(0, Number.parseInt(String(process.env.TRANSFER_MATRICULA_LOOKUP_WAIT_RETRY_MS || '350'), 10) || 350);
const firstSimularSettlingMs = Math.max(0, Number.parseInt(String(process.env.TRANSFER_FIRST_SIMULAR_SETTLING_MS || '250'), 10) || 250);
const contribuintePostFillWaitMs = Math.max(0, Number.parseInt(String(process.env.TRANSFER_CONTRIBUINTE_POST_FILL_MS || '120'), 10) || 120);
const contribuintePostLookupWaitMs = Math.max(0, Number.parseInt(String(process.env.TRANSFER_CONTRIBUINTE_POST_LOOKUP_MS || '120'), 10) || 120);
const contribuinteNameWaitTimeoutMs = Math.max(1200, Number.parseInt(String(process.env.TRANSFER_CONTRIBUINTE_NAME_WAIT_MS || '3500'), 10) || 3500);
const contribuinteNamePollMs = Math.max(60, Number.parseInt(String(process.env.TRANSFER_CONTRIBUINTE_NAME_POLL_MS || '120'), 10) || 120);
const simularPostClickReadyTimeoutMs = Math.max(1500, Number.parseInt(String(process.env.TRANSFER_SIMULAR_READY_TIMEOUT_MS || '10000'), 10) || 10000);
const matriculaAutoDialogInitialWaitMs = Math.max(80, Number.parseInt(String(process.env.TRANSFER_MATRICULA_AUTO_DIALOG_WAIT_MS || '200'), 10) || 200);
const loginStepTransitionMs = Math.max(0, Number.parseInt(String(process.env.TRANSFER_LOGIN_STEP_TRANSITION_MS || '500'), 10) || 500);
const homeSettlingMs = Math.max(0, Number.parseInt(String(process.env.TRANSFER_HOME_SETTLING_MS || '800'), 10) || 800);
const menuTransitionMs = Math.max(0, Number.parseInt(String(process.env.TRANSFER_MENU_TRANSITION_MS || '300'), 10) || 300);
const simuladoresListSettlingMs = Math.max(0, Number.parseInt(String(process.env.TRANSFER_SIMULADORES_LIST_SETTLING_MS || '700'), 10) || 700);
const tileOpenSettlingMs = Math.max(0, Number.parseInt(String(process.env.TRANSFER_TILE_OPEN_SETTLING_MS || '700'), 10) || 700);
const manualCaptureArmingMs = Math.max(0, Number.parseInt(String(process.env.TRANSFER_MANUAL_CAPTURE_ARMING_MS || '200'), 10) || 200);
const vehicleChooserPostLookupWaitMs = Math.max(900, Number.parseInt(String(process.env.TRANSFER_VEHICLE_CHOOSER_POST_LOOKUP_MS || '2500'), 10) || 2500);
const vehiclePostSelectWaitMs = Math.max(0, Number.parseInt(String(process.env.TRANSFER_VEHICLE_POST_SELECT_MS || '350'), 10) || 350);
const vehicleLoadedWaitTimeoutMs = Math.max(1200, Number.parseInt(String(process.env.TRANSFER_VEHICLE_LOADED_WAIT_MS || '2500'), 10) || 2500);
const vehicleLoadedSoftPauseMs = Math.max(0, Number.parseInt(String(process.env.TRANSFER_VEHICLE_LOADED_SOFT_PAUSE_MS || '350'), 10) || 350);
const vehiclePostSelectLoadWaitMs = Math.max(200, Number.parseInt(String(process.env.TRANSFER_VEHICLE_POST_SELECT_LOAD_WAIT_MS || '900'), 10) || 900);
const skipVehicleLoadedWait = ['1', 'true', 'yes'].includes(String(process.env.TRANSFER_SKIP_VEHICLE_LOADED_WAIT || 'true').trim().toLowerCase());
const captureMatriculaIntermediateShot = ['1', 'true', 'yes'].includes(String(process.env.TRANSFER_CAPTURE_MATRICULA_SHOT || 'false').trim().toLowerCase());
const loginLandingWaitTimeoutMs = Math.max(3000, Number.parseInt(String(process.env.TRANSFER_LOGIN_LANDING_WAIT_MS || '12000'), 10) || 12000);
const menuSimuladoresReadyWaitMs = Math.max(600, Number.parseInt(String(process.env.TRANSFER_MENU_READY_WAIT_MS || '2500'), 10) || 2500);
const clienteReadyElementId = 'Zurich_PT_Theme_wtZurich_PT_Theme_Layout_SideBar_block_WebPatterns_wt24_block_wtColumn1_wtMainContent_wt20_wtItems_wt893_wtContent_WebPatterns_wt271_block_wtColumn1_Simuladores_WB_wt619_block_wtcnt_Cliente';
const clienteReadyWaitTimeoutMs = Math.max(300, Number.parseInt(String(process.env.TRANSFER_CLIENTE_READY_WAIT_MS || '2000'), 10) || 2000);
const clienteReadyPollMs = Math.max(40, Number.parseInt(String(process.env.TRANSFER_CLIENTE_READY_POLL_MS || '90'), 10) || 90);

function cleanEnv(value) {
  if (!value) return '';
  return String(value).split('#')[0].trim();
}

function getFirebaseClientConfigFromEnv() {
  const apiKey = cleanEnv(process.env.VITE_FIREBASE_API_KEY);
  const authDomain = cleanEnv(process.env.VITE_FIREBASE_AUTH_DOMAIN);
  const projectId = cleanEnv(process.env.VITE_FIREBASE_PROJECT_ID);
  const storageBucket = cleanEnv(process.env.VITE_FIREBASE_STORAGE_BUCKET);
  const messagingSenderId = cleanEnv(process.env.VITE_FIREBASE_MESSAGING_SENDER_ID);
  const appId = cleanEnv(process.env.VITE_FIREBASE_APP_ID);

  if (!apiKey || !authDomain || !projectId || !storageBucket || !messagingSenderId || !appId) {
    return null;
  }

  return {
    apiKey,
    authDomain,
    projectId,
    storageBucket,
    messagingSenderId,
    appId,
  };
}

function getFirebaseClientApp(config) {
  if (!config) return null;
  return getApps().length ? getApp() : initializeApp(config);
}

async function loadLatestAutoSimulationPayload() {
  const config = getFirebaseClientConfigFromEnv();
  if (!config) return null;

  const app = getFirebaseClientApp(config);
  if (!app) return null;

  const db = getFirestore(app);

  const candidates = [];

  try {
    const simulationsQuery = query(
      collectionGroup(db, 'simulations'),
      where('type', '==', 'auto'),
      limit(25)
    );

    const snapshot = await getDocs(simulationsQuery);
    snapshot.forEach((document) => {
      const data = document.data() || {};
      candidates.push({
        id: document.id,
        path: document.ref.path,
        payload: data.payload || {},
        raw: data,
      });
    });
  } catch {
  }

  try {
    const jobsQuery = query(
      collection(db, 'simulationTransferJobs'),
      where('simulationType', '==', 'auto'),
      limit(25)
    );

    const jobsSnapshot = await getDocs(jobsQuery);
    jobsSnapshot.forEach((document) => {
      const data = document.data() || {};
      candidates.push({
        id: document.id,
        path: document.ref.path,
        payload: data.payload || {},
        raw: data,
      });
    });
  } catch {
  }

  if (candidates.length > 0) {
    const toMillis = (value) => {
      if (!value) return 0;
      if (typeof value?.toMillis === 'function') return value.toMillis();
      if (typeof value?.seconds === 'number') return value.seconds * 1000;
      if (typeof value === 'string' || value instanceof Date) {
        const parsed = new Date(value).getTime();
        return Number.isFinite(parsed) ? parsed : 0;
      }
      return 0;
    };

    candidates.sort((left, right) => {
      const leftMillis = toMillis(left.raw?.createdAt) || toMillis(left.raw?.updatedAt) || toMillis(left.raw?.capturedAt);
      const rightMillis = toMillis(right.raw?.createdAt) || toMillis(right.raw?.updatedAt) || toMillis(right.raw?.capturedAt);
      return rightMillis - leftMillis;
    });

    return candidates[0];
  }

  return null;
}

async function fillFirstMatchingField(page, selectors, value, fieldLabel, metaState) {
  if (value === undefined || value === null || String(value).trim() === '') return false;
  for (const selector of selectors) {
    const locator = page.locator(selector).first();
    const count = await locator.count().catch(() => 0);
    if (!count) continue;
    const visible = await locator.isVisible().catch(() => true);
    if (!visible) continue;
    try {
      await locator.fill(String(value));
      metaState.steps.push(`prefill ${fieldLabel} -> ${selector}`);
      return true;
    } catch {
      continue;
    }
  }
  return false;
}

async function forceFocusMatriculaField(page, selectors, metaState, stepLabel = 'matricula-focus', options = {}) {
  const focusClicks = Math.max(1, Number(options.focusClicks) || matriculaFieldFocusClicks);
  const focusGapMs = Math.max(0, Number(options.focusGapMs) || matriculaFieldFocusClickGapMs);
  const initialForce = Boolean(options.initialForce);
  const clickTimeoutMs = Math.max(300, Number(options.clickTimeoutMs) || 15000);
  for (const selector of selectors) {
    const locator = page.locator(selector).first();
    const count = await locator.count().catch(() => 0);
    if (!count) continue;
    const visible = await locator.isVisible().catch(() => false);
    if (!visible) continue;

    for (let focusAttempt = 1; focusAttempt <= focusClicks; focusAttempt++) {
      try {
        await locator.click({ timeout: clickTimeoutMs, force: initialForce || focusAttempt > 1 });
      } catch {
        await locator.click({ force: true, timeout: clickTimeoutMs }).catch(() => null);
      }
      if (focusAttempt < focusClicks) {
        await page.waitForTimeout(focusGapMs);
      }
    }

    metaState.steps.push(`${stepLabel} -> ${selector} (${focusClicks} clicks)`);
    return true;
  }

  metaState.steps.push(`${stepLabel} -> not-found`);
  return false;
}

async function typeMatriculaProgressively(page, selectors, value, metaState, options = {}) {
  if (!value || String(value).trim() === '') return false;
  const skipInitialFocus = Boolean(options.skipInitialFocus);
  const waitEditableMs = Math.max(300, Number.parseInt(String(process.env.TRANSFER_MATRICULA_EDITABLE_WAIT_MS || '1800'), 10) || 1800);
  const plateOriginal = String(value).trim();
  const plateRaw = plateOriginal.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
  const plateFormatted = plateOriginal.toUpperCase();
  const variants = Array.from(new Set([plateFormatted, plateRaw].filter(Boolean)));

  for (const selector of selectors) {
    const locator = page.locator(selector).first();
    const count = await locator.count().catch(() => 0);
    if (!count) continue;
    const visible = await locator.isVisible().catch(() => false);
    if (!visible) continue;

    const editableStarted = Date.now();
    let editable = await locator.isEditable().catch(() => false);
    while (!editable && Date.now() - editableStarted < waitEditableMs) {
      await page.waitForTimeout(90);
      editable = await locator.isEditable().catch(() => false);
    }
    if (!editable) {
      metaState.steps.push(`matricula-editable -> timeout (${selector})`);
      continue;
    }

    for (const variant of variants) {
      try {
        if (skipInitialFocus) {
          try {
            await locator.click({ timeout: 800, force: true });
          } catch {
            await locator.click({ timeout: 1200, force: true }).catch(() => null);
          }
        } else {
          for (let focusAttempt = 1; focusAttempt <= matriculaFieldFocusClicks; focusAttempt++) {
            try {
              await locator.click({ timeout: 15000, force: focusAttempt > 1 });
            } catch {
              await locator.click({ force: true, timeout: 15000 }).catch(() => null);
            }
            if (focusAttempt < matriculaFieldFocusClicks) {
              await page.waitForTimeout(matriculaFieldFocusClickGapMs);
            }
          }
          metaState.steps.push(`matricula-focus -> ${selector} (${matriculaFieldFocusClicks} clicks)`);
        }

        await page.keyboard.down('Control');
        await locator.press('KeyA').catch(() => null);
        await page.keyboard.up('Control');
        await locator.press('Backspace').catch(() => null);
        await locator.fill('');
        await page.waitForTimeout(90);

        for (const char of variant) {
          await locator.type(char, { delay: matriculaCharTypeDelayMs });
          await page.waitForTimeout(matriculaInterCharPauseMs);
        }

        await page.waitForTimeout(matriculaPostTypePauseMs);
        await locator.press('Tab').catch(() => null);
        await page.waitForTimeout(matriculaTabPauseMs);
        await page.keyboard.press('Shift+Tab').catch(() => null);
        await page.waitForTimeout(matriculaShiftTabPauseMs);
        await locator.press('Enter').catch(() => null);
        await page.waitForTimeout(matriculaEnterPauseMs);

        const typed = await locator.inputValue().catch(() => '');
        const typedNormalized = String(typed || '').replace(/[^A-Za-z0-9]/g, '').toUpperCase();
        if (typedNormalized.length < 5) {
          metaState.steps.push(`prefill matricula-progressive -> short-value (${selector}: ${typed || variant})`);
          continue;
        }
        metaState.steps.push(`prefill matricula-progressive -> ${selector} (${typed || variant})`);
        return true;
      } catch {
        continue;
      }
    }
  }
  return false;
}

async function clickOutsideField(page, selectors, metaState) {
  for (const selector of selectors) {
    const locator = page.locator(selector).first();
    const count = await locator.count().catch(() => 0);
    if (!count) continue;
    const visible = await locator.isVisible().catch(() => false);
    if (!visible) continue;
    const box = await locator.boundingBox().catch(() => null);
    if (!box) continue;

    const x = Math.max(20, Math.round(box.x - 80));
    const y = Math.max(20, Math.round(box.y + box.height + 30));
    try {
      await page.mouse.click(x, y);
      metaState.steps.push(`matricula-blur-click -> outside @${x},${y}`);
      return true;
    } catch {
      continue;
    }
  }

  const clickedBody = await page.evaluate(() => {
    try {
      document.body.click();
      return true;
    } catch {
      return false;
    }
  }).catch(() => false);
  if (clickedBody) {
    metaState.steps.push('matricula-blur-click -> body');
    return true;
  }
  metaState.steps.push('matricula-blur-click -> not-possible');
  return false;
}

async function clickLookupNearField(page, fieldSelectors, fieldLabel, metaState) {
  const result = await page.evaluate(({ selectors }) => {
    function isVisible(el) {
      if (!el) return false;
      const style = window.getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0;
    }

    function clickTarget(target) {
      if (!target) return false;
      try {
        target.click();
        return true;
      } catch {
        return false;
      }
    }

    function textFrom(el) {
      return `${el.getAttribute('title') || ''} ${el.getAttribute('aria-label') || ''} ${el.getAttribute('alt') || ''} ${el.getAttribute('class') || ''} ${(el.textContent || '')}`.toLowerCase();
    }

    const keyword = /(lupa|pesquis|search|procur|consulta|find|look)/i;
    const directCandidates = 'button,a,input[type="button"],input[type="submit"],img,[role="button"],span,div';

    for (const selector of selectors) {
      const field = document.querySelector(selector);
      if (!field || !isVisible(field)) continue;

      const scopes = [
        field.closest('td'),
        field.closest('tr'),
        field.closest('div'),
        field.parentElement,
      ].filter(Boolean);

      for (const scope of scopes) {
        const candidates = Array.from(scope.querySelectorAll(directCandidates));
        for (const candidate of candidates) {
          if (candidate === field) continue;
          if (!isVisible(candidate)) continue;
          const text = textFrom(candidate);
          const imgSrc = candidate.getAttribute('src') || '';
          const classText = (candidate.getAttribute('class') || '').toLowerCase();
          const withinWSearch = Boolean(candidate.closest('.WSearch, .wsearch, [class*="WSearch" i], [class*="wsearch" i]'));
          const iconLike = /fa\b|fa-|icon|glyph/.test(classText);
          if (!keyword.test(text) && !/lupa|search|find/i.test(imgSrc) && !(withinWSearch && iconLike)) continue;
          if (candidate.tagName.toLowerCase() === 'img' && candidate.parentElement) {
            if (clickTarget(candidate.parentElement)) {
              return { ok: true, mode: 'img-parent', selector, matched: text || imgSrc };
            }
          }
          if (clickTarget(candidate)) {
            return { ok: true, mode: 'nearby', selector, matched: text || imgSrc };
          }
        }
      }
    }

    const globalSelectors = [
      'button[title*="pesquis" i]',
      'button[aria-label*="pesquis" i]',
      'button[title*="search" i]',
      'a[title*="pesquis" i]',
      'a[title*="search" i]',
      'img[alt*="lupa" i]',
      'img[src*="lupa" i]',
      'img[src*="search" i]'
    ];

    for (const globalSelector of globalSelectors) {
      const candidate = document.querySelector(globalSelector);
      if (!candidate || !isVisible(candidate)) continue;
      if (candidate.tagName.toLowerCase() === 'img' && candidate.parentElement) {
        if (clickTarget(candidate.parentElement)) {
          return { ok: true, mode: 'global-img-parent', selector: globalSelector, matched: textFrom(candidate) };
        }
      }
      if (clickTarget(candidate)) {
        return { ok: true, mode: 'global', selector: globalSelector, matched: textFrom(candidate) };
      }
    }

    return { ok: false };
  }, { selectors: fieldSelectors });

  if (result?.ok) {
    metaState.steps.push(`lookup ${fieldLabel} -> ${result.mode} (${result.selector})`);
    return true;
  }
  for (const selector of fieldSelectors) {
    const field = page.locator(selector).first();
    const count = await field.count().catch(() => 0);
    if (!count) continue;
    const visible = await field.isVisible().catch(() => false);
    if (!visible) continue;
    const box = await field.boundingBox().catch(() => null);
    if (!box) continue;
    const x = Math.round(box.x + box.width + 24);
    const y = Math.round(box.y + box.height / 2);
    try {
      await page.mouse.click(x, y);
      metaState.steps.push(`lookup ${fieldLabel} -> offset-click (${selector}) @${x},${y}`);
      return true;
    } catch {
      continue;
    }
  }
  metaState.steps.push(`lookup ${fieldLabel} -> not-found`);
  return false;
}

async function readFieldValue(page, selector) {
  const locator = page.locator(selector).first();
  const count = await locator.count().catch(() => 0);
  if (!count) return '';
  const visible = await locator.isVisible().catch(() => false);
  if (!visible) return '';
  const tagName = await locator.evaluate((el) => el.tagName.toLowerCase()).catch(() => '');
  if (tagName === 'input' || tagName === 'textarea' || tagName === 'select') {
    return (await locator.inputValue().catch(() => '')).trim();
  }
  return (await locator.innerText().catch(() => '')).trim();
}

async function snapshotValues(page, selectors) {
  const result = {};
  for (const selector of selectors) {
    result[selector] = await readFieldValue(page, selector);
  }
  return result;
}

async function waitForValueAppearance(page, selectors, baseline, timeoutMs, stepLabel, metaState, options = {}) {
  const allowExistingNonEmpty = Boolean(options.allowExistingNonEmpty);
  const pollIntervalMs = Math.max(60, Number(options.pollIntervalMs) || 450);
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    for (const selector of selectors) {
      const current = await readFieldValue(page, selector);
      const before = baseline?.[selector] || '';
      if (allowExistingNonEmpty && current) {
        metaState.steps.push(`${stepLabel} -> ${selector} (${current.slice(0, 60)})`);
        return true;
      }
      if (current && current !== before) {
        metaState.steps.push(`${stepLabel} -> ${selector} (${current.slice(0, 60)})`);
        return true;
      }
    }
    await page.waitForTimeout(pollIntervalMs);
  }
  metaState.steps.push(`${stepLabel} -> timeout`);
  return false;
}

async function waitForAnyFieldNonEmpty(page, selectors, timeoutMs, stepLabel, metaState) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    for (const selector of selectors) {
      const value = await readFieldValue(page, selector);
      if (value) {
        metaState.steps.push(`${stepLabel} -> ${selector} (${value.slice(0, 40)})`);
        return { ok: true, selector, value };
      }
    }
    await page.waitForTimeout(350);
  }
  metaState.steps.push(`${stepLabel} -> timeout`);
  return { ok: false };
}

async function waitForVehicleChooser(page, knownPages, timeoutMs, metaState) {
  const context = page.context();
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    const freshPopup = context.pages().find((candidate) => !knownPages.has(candidate));
    if (freshPopup && freshPopup !== page) {
      metaState.steps.push(`vehicle-dialog-detected -> popup (${freshPopup.url() || 'about:blank'})`);
      return { ok: true, kind: 'popup' };
    }

    const dialogVisible = await page
      .locator('[role="dialog"], .modal, .ui-dialog, .popup, .modal-dialog, [id*="dialog" i], [class*="dialog" i], table tbody tr')
      .first()
      .isVisible()
      .catch(() => false);
    if (dialogVisible) {
      metaState.steps.push('vehicle-dialog-detected -> in-page-dialog');
      return { ok: true, kind: 'dialog' };
    }

    await page.waitForTimeout(160);
  }
  metaState.steps.push('vehicle-dialog-detected -> timeout');
  return { ok: false };
}

async function waitForVehicleDialogOrLoaded(page, knownPages, watchSelectors, baseline, timeoutMs, metaState) {
  const context = page.context();
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    const freshPopup = context.pages().find((candidate) => !knownPages.has(candidate));
    if (freshPopup && freshPopup !== page) {
      metaState.steps.push(`vehicle-dialog-or-loaded -> popup (${freshPopup.url() || 'about:blank'})`);
      return { ok: true, mode: 'popup' };
    }

    const dialogVisible = await page
      .locator('[role="dialog"], .modal, .ui-dialog, .popup, .modal-dialog, [id*="dialog" i], [class*="dialog" i], table tbody tr')
      .first()
      .isVisible()
      .catch(() => false);
    if (dialogVisible) {
      metaState.steps.push('vehicle-dialog-or-loaded -> in-page-dialog');
      return { ok: true, mode: 'dialog' };
    }

    for (const selector of watchSelectors) {
      const current = await readFieldValue(page, selector);
      const before = baseline?.[selector] || '';
      if (current && current !== before) {
        metaState.steps.push(`vehicle-dialog-or-loaded -> field-updated (${selector})`);
        return { ok: true, mode: 'loaded' };
      }
    }

    await page.waitForTimeout(180);
  }

  metaState.steps.push('vehicle-dialog-or-loaded -> timeout');
  return { ok: false, mode: 'timeout' };
}

async function reopenVehicleChooserFromMatricula(page, matriculaSelectors, metaState, attempt) {
  metaState.steps.push(`manual-select-vehicle -> reopen-attempt ${attempt}`);
  const stepLabel = attempt === 1 ? 'lookup matricula manual-reopen' : `lookup matricula manual-reopen-${attempt}`;

  let clicked = false;
  if (effectiveMatriculaLupaSelector) {
    clicked = await clickForcedSelector(page, effectiveMatriculaLupaSelector, stepLabel, metaState);
    if (!clicked) {
      metaState.steps.push(`manual-select-vehicle -> forced-selector-not-available (${effectiveMatriculaLupaSelector})`);
    }
  }

  if (!clicked) {
    clicked = await clickLookupNearField(page, matriculaSelectors, `matricula-manual-reopen-${attempt}`, metaState);
  }

  if (clicked) {
    metaState.steps.push(`manual-select-vehicle -> chooser-reopened-attempt ${attempt}`);
  } else {
    metaState.steps.push(`manual-select-vehicle -> chooser-reopen-failed ${attempt}`);
  }
  return clicked;
}

async function recoverVehicleChooserByReclickAndSelectFirst(page, knownPages, matriculaSelectors, metaState, reasonLabel = 'vehicle-recovery') {
  metaState.steps.push(`${reasonLabel} -> reclick-matricula-lupa-and-select-first:start`);

  const reopened = await reopenVehicleChooserFromMatricula(page, matriculaSelectors, metaState, 'recovery');
  if (!reopened) {
    metaState.steps.push(`${reasonLabel} -> reopen-failed`);
    return false;
  }

  await page.waitForTimeout(Math.min(700, Math.max(200, manualSelectVehicleReopenWaitMs)));
  const chooser = await waitForVehicleChooser(page, knownPages, Math.max(1200, Math.min(3800, vehicleChooserPostLookupWaitMs)), metaState);
  if (!chooser.ok) {
    metaState.steps.push(`${reasonLabel} -> chooser-not-detected-after-reclick`);
  }

  const selected = await selectFirstVehicleResult(page, metaState, knownPages);
  if (!selected) {
    metaState.steps.push(`${reasonLabel} -> select-first-failed`);
    return false;
  }

  metaState.steps.push(`${reasonLabel} -> select-first-success`);
  return true;
}

async function waitForManualVehicleSelection(page, knownPages, watchSelectors, baseline, timeoutMs, metaState, options = {}) {
  const context = page.context();
  const started = Date.now();
  let popupSeen = false;
  let dialogSeen = false;
  const matriculaSelectors = Array.isArray(options.matriculaSelectors) ? options.matriculaSelectors : [];
  const reopenAttempts = Math.max(0, Number(options.reopenAttempts) || 0);
  const reopenWaitMs = Math.max(100, Number(options.reopenWaitMs) || 200);
  const reopenInvisibleIdleMs = Math.max(350, Number(options.reopenInvisibleIdleMs) || manualSelectVehicleInvisibleIdleMs);
  const lateFieldWaitMs = Math.max(300, Number(options.lateFieldWaitMs) || manualSelectVehicleLateFieldWaitMs);
  const autoPickAfterMs = Math.max(1200, Number(options.autoPickAfterMs) || manualSelectVehicleAutoPickAfterMs);
  const learnVehicleClick = Boolean(options.learnVehicleClick);
  const maxReopenAttempts = learnVehicleClick ? manualLearnSecondLupaRetryAttempts : reopenAttempts;
  let usedReopenAttempts = 0;
  let lastChooserVisibleAt = Date.now();
  let dialogVisibleSince = 0;
  let autoPickTried = false;
  let learnClickCaptured = false;
  let userInteractionPhaseStarted = false;

  metaState.steps.push('manual-select-vehicle -> aguardando seleção manual do utilizador');
  if (learnVehicleClick) {
    metaState.steps.push('manual-select-vehicle -> learn-mode ativo (não terminar sem clique aprendido)');
  }

  while (Date.now() - started < timeoutMs) {
    const allPages = context.pages();
    const extraPages = allPages.filter((candidate) => !knownPages.has(candidate) && candidate !== page);
    if (extraPages.length > 0) {
      popupSeen = true;
      lastChooserVisibleAt = Date.now();
    }

    const dialogVisible = await page
      .locator('[role="dialog"], .modal, .ui-dialog, .popup, .modal-dialog, [id*="dialog" i], [class*="dialog" i], table tbody tr')
      .first()
      .isVisible()
      .catch(() => false);

    if (dialogVisible) {
      dialogSeen = true;
      lastChooserVisibleAt = Date.now();
      if (!dialogVisibleSince) {
        dialogVisibleSince = Date.now();
      }
    } else {
      dialogVisibleSince = 0;
    }

    for (const selector of watchSelectors) {
      const current = await readFieldValue(page, selector);
      const before = baseline?.[selector] || '';
      if (current && current !== before) {
        metaState.steps.push(`manual-select-vehicle -> field-updated (${selector})`);
        if (learnVehicleClick && !learnClickCaptured) {
          metaState.steps.push('manual-select-vehicle -> field-update detetado sem learned-click (assumir seleção manual)');
        }
        return { ok: true, mode: 'loaded' };
      }
    }

    if (dialogSeen && !dialogVisible) {
      metaState.steps.push('manual-select-vehicle -> dialog-closed-without-selection');

      if (learnVehicleClick && userInteractionPhaseStarted) {
        const lateLoadedAfterClose = await waitForValueAppearance(
          page,
          watchSelectors,
          baseline,
          Math.max(450, Math.min(1400, lateFieldWaitMs)),
          'manual-select-vehicle-close-after-interaction-field-update',
          metaState,
          { allowExistingNonEmpty: true, pollIntervalMs: 120 }
        );
        if (!lateLoadedAfterClose) {
          metaState.steps.push('manual-select-vehicle -> assume-selection-after-close (sem novas tentativas)');
        }
        return { ok: true, mode: lateLoadedAfterClose ? 'loaded-after-close' : 'assume-selected-after-close' };
      }

      if (learnVehicleClick && usedReopenAttempts < maxReopenAttempts && matriculaSelectors.length > 0) {
        usedReopenAttempts += 1;
        metaState.steps.push('manual-select-vehicle -> segunda-tentativa-lupa (após fechar diálogo)');
        const reopened = await reopenVehicleChooserFromMatricula(page, matriculaSelectors, metaState, usedReopenAttempts);
        if (reopened) {
          popupSeen = false;
          dialogSeen = false;
          lastChooserVisibleAt = Date.now();
          await page.waitForTimeout(reopenWaitMs);
          continue;
        }
      }

      const lateLoaded = await waitForValueAppearance(
        page,
        watchSelectors,
        baseline,
        Math.min(lateFieldWaitMs, Math.max(300, timeoutMs)),
        'manual-select-vehicle-late-field-update',
        metaState,
        { allowExistingNonEmpty: true, pollIntervalMs: 140 }
      );
      if (lateLoaded) {
        return { ok: true, mode: 'loaded-after-close' };
      }

      if (usedReopenAttempts < maxReopenAttempts && matriculaSelectors.length > 0) {
        usedReopenAttempts += 1;
        const reopened = await reopenVehicleChooserFromMatricula(page, matriculaSelectors, metaState, usedReopenAttempts);
        if (reopened) {
          popupSeen = false;
          dialogSeen = false;
          await page.waitForTimeout(reopenWaitMs);
          continue;
        }
      }
    }

    if (popupSeen && extraPages.length === 0) {
      metaState.steps.push('manual-select-vehicle -> popup-closed-without-selection');

      if (learnVehicleClick && userInteractionPhaseStarted) {
        const lateLoadedAfterPopupClose = await waitForValueAppearance(
          page,
          watchSelectors,
          baseline,
          Math.max(450, Math.min(1400, lateFieldWaitMs)),
          'manual-select-vehicle-popup-close-after-interaction-field-update',
          metaState,
          { allowExistingNonEmpty: true, pollIntervalMs: 120 }
        );
        if (!lateLoadedAfterPopupClose) {
          metaState.steps.push('manual-select-vehicle -> assume-selection-after-popup-close (sem novas tentativas)');
        }
        return { ok: true, mode: lateLoadedAfterPopupClose ? 'loaded-after-popup-close' : 'assume-selected-after-popup-close' };
      }

      if (learnVehicleClick && usedReopenAttempts < maxReopenAttempts && matriculaSelectors.length > 0) {
        usedReopenAttempts += 1;
        metaState.steps.push('manual-select-vehicle -> segunda-tentativa-lupa (após fechar popup)');
        const reopened = await reopenVehicleChooserFromMatricula(page, matriculaSelectors, metaState, usedReopenAttempts);
        if (reopened) {
          popupSeen = false;
          dialogSeen = false;
          lastChooserVisibleAt = Date.now();
          await page.waitForTimeout(reopenWaitMs);
          continue;
        }
      }

      const lateLoaded = await waitForValueAppearance(
        page,
        watchSelectors,
        baseline,
        Math.min(lateFieldWaitMs, Math.max(300, timeoutMs)),
        'manual-select-vehicle-late-field-update',
        metaState,
        { allowExistingNonEmpty: true, pollIntervalMs: 140 }
      );
      if (lateLoaded) {
        return { ok: true, mode: 'loaded-after-popup-close' };
      }

      if (usedReopenAttempts < maxReopenAttempts && matriculaSelectors.length > 0) {
        usedReopenAttempts += 1;
        const reopened = await reopenVehicleChooserFromMatricula(page, matriculaSelectors, metaState, usedReopenAttempts);
        if (reopened) {
          popupSeen = false;
          dialogSeen = false;
          await page.waitForTimeout(reopenWaitMs);
          continue;
        }
      }
    }

    if (!learnVehicleClick && dialogVisible && !autoPickTried && Date.now() - dialogVisibleSince >= autoPickAfterMs) {
      autoPickTried = true;
      metaState.steps.push(`manual-select-vehicle -> auto-pick-first after ${Date.now() - dialogVisibleSince}ms`);
      const autoPicked = await selectFirstVehicleResult(page, metaState, knownPages);
      if (autoPicked) {
        const loadedAfterAutoPick = await waitForValueAppearance(
          page,
          watchSelectors,
          baseline,
          Math.max(700, Math.min(2200, lateFieldWaitMs + 600)),
          'manual-select-vehicle-auto-pick-field-update',
          metaState,
          { allowExistingNonEmpty: true, pollIntervalMs: 120 }
        );
        if (loadedAfterAutoPick) {
          return { ok: true, mode: 'auto-picked' };
        }
        metaState.steps.push('manual-select-vehicle -> auto-pick-clicked-without-immediate-field-update');
        return { ok: true, mode: 'auto-picked-clicked' };
      }
    }

    if (dialogVisible && learnVehicleClick && !learnClickCaptured) {
      userInteractionPhaseStarted = true;
      metaState.steps.push('manual-select-vehicle -> learning-click: aguardando clique do utilizador');
      const learned = await captureSingleUserClickPassive(
        page,
        'manual-select-vehicle-learning-click',
        metaState,
        manualLearnCaptureWindowMs
      );
      if (learned) {
        learnClickCaptured = true;
        return { ok: true, mode: 'learned-click' };
      }
      metaState.steps.push('manual-select-vehicle -> learning-click sem evento, continuar');

      if (usedReopenAttempts < maxReopenAttempts && matriculaSelectors.length > 0) {
        usedReopenAttempts += 1;
        metaState.steps.push('manual-select-vehicle -> nova tentativa de lupa após janela sem clique');
        const reopened = await reopenVehicleChooserFromMatricula(page, matriculaSelectors, metaState, usedReopenAttempts);
        if (reopened) {
          popupSeen = false;
          dialogSeen = false;
          lastChooserVisibleAt = Date.now();
          await page.waitForTimeout(reopenWaitMs);
          continue;
        }
      }
    }

    if (!dialogVisible && extraPages.length === 0 && usedReopenAttempts < maxReopenAttempts && matriculaSelectors.length > 0) {
      const chooserInvisibleForMs = Date.now() - lastChooserVisibleAt;
      if (chooserInvisibleForMs >= reopenInvisibleIdleMs) {
        usedReopenAttempts += 1;
        metaState.steps.push(`manual-select-vehicle -> chooser-invisible ${chooserInvisibleForMs}ms`);
        const reopened = await reopenVehicleChooserFromMatricula(page, matriculaSelectors, metaState, usedReopenAttempts);
        if (reopened) {
          popupSeen = false;
          dialogSeen = false;
          lastChooserVisibleAt = Date.now();
          await page.waitForTimeout(reopenWaitMs);
          continue;
        }
      }
    }

    await page.waitForTimeout(180);
  }

  metaState.steps.push('manual-select-vehicle -> timeout');
  return { ok: false, mode: 'timeout' };
}

async function clickForcedSelector(page, selector, stepLabel, metaState) {
  if (!selector) return false;
  const locator = page.locator(selector).first();
  const count = await locator.count().catch(() => 0);
  if (!count) return false;
  const visible = await locator.isVisible().catch(() => false);
  if (!visible) return false;
  try {
    await locator.click({ timeout: 15000 });
    metaState.steps.push(`${stepLabel} -> forced-selector (${selector})`);
    return true;
  } catch {
    try {
      await locator.click({ force: true, timeout: 15000 });
      metaState.steps.push(`${stepLabel} -> forced-selector-force (${selector})`);
      return true;
    } catch {
    }
  }

  const clickedAncestor = await locator.evaluate((element) => {
    const candidates = [
      element.parentElement,
      element.closest('a'),
      element.closest('button'),
      element.closest('[role="button"]'),
      element.closest('span'),
      element.closest('div'),
    ].filter(Boolean);

    for (const candidate of candidates) {
      try {
        candidate.click();
        return true;
      } catch {
      }
    }
    return false;
  }).catch(() => false);

  if (clickedAncestor) {
    metaState.steps.push(`${stepLabel} -> forced-selector-ancestor (${selector})`);
    return true;
  }

  return false;
}

async function captureSingleUserClick(page, stepLabel, metaState) {
  const payload = await page.evaluate(() => {
    return new Promise((resolve) => {
      function cssPath(element) {
        if (!element || !(element instanceof Element)) return '';
        const parts = [];
        let current = element;
        while (current && current.nodeType === Node.ELEMENT_NODE && parts.length < 8) {
          let part = current.nodeName.toLowerCase();
          if (current.id) {
            part += `#${current.id}`;
            parts.unshift(part);
            break;
          }
          if (current.classList && current.classList.length > 0) {
            part += '.' + Array.from(current.classList).slice(0, 2).join('.');
          }
          const parent = current.parentElement;
          if (parent) {
            const siblings = Array.from(parent.children).filter((node) => node.nodeName === current.nodeName);
            if (siblings.length > 1) {
              part += `:nth-of-type(${siblings.indexOf(current) + 1})`;
            }
          }
          parts.unshift(part);
          current = current.parentElement;
        }
        return parts.join(' > ');
      }

      function onClick(event) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        const target = event.target;
        const payload = {
          x: event.clientX,
          y: event.clientY,
          tag: target?.tagName?.toLowerCase?.() || null,
          id: target?.id || null,
          className: target?.className || null,
          title: target?.getAttribute?.('title') || null,
          ariaLabel: target?.getAttribute?.('aria-label') || null,
          text: (target?.textContent || '').trim().slice(0, 120),
          selector: cssPath(target),
          parentSelector: cssPath(target?.parentElement || null),
        };
        document.removeEventListener('click', onClick, true);
        resolve(payload);
      }

      document.addEventListener('click', onClick, true);
    });
  });

  metaState.steps.push(`${stepLabel} -> manual-click (${payload.selector || payload.tag || 'unknown'}) @${payload.x},${payload.y}`);
  return payload;
}

async function captureSingleUserClickPassive(page, stepLabel, metaState, timeoutMs = 120000) {
  const payload = await page.evaluate((timeout) => {
    return new Promise((resolve) => {
      function cssPath(element) {
        if (!element || !(element instanceof Element)) return '';
        const parts = [];
        let current = element;
        while (current && current.nodeType === Node.ELEMENT_NODE && parts.length < 10) {
          let part = current.nodeName.toLowerCase();
          if (current.id) {
            part += `#${current.id}`;
            parts.unshift(part);
            break;
          }
          if (current.classList && current.classList.length > 0) {
            part += '.' + Array.from(current.classList).slice(0, 3).join('.');
          }
          const parent = current.parentElement;
          if (parent) {
            const siblings = Array.from(parent.children).filter((node) => node.nodeName === current.nodeName);
            if (siblings.length > 1) {
              part += `:nth-of-type(${siblings.indexOf(current) + 1})`;
            }
          }
          parts.unshift(part);
          current = current.parentElement;
        }
        return parts.join(' > ');
      }

      function cleanup() {
        clearTimeout(timer);
        document.removeEventListener('click', onClick, true);
      }

      function onClick(event) {
        const target = event.target;
        const data = {
          x: event.clientX,
          y: event.clientY,
          tag: target?.tagName?.toLowerCase?.() || null,
          id: target?.id || null,
          className: target?.className || null,
          title: target?.getAttribute?.('title') || null,
          ariaLabel: target?.getAttribute?.('aria-label') || null,
          text: (target?.textContent || '').trim().slice(0, 160),
          selector: cssPath(target),
          parentSelector: cssPath(target?.parentElement || null),
          timestamp: Date.now(),
        };
        cleanup();
        resolve(data);
      }

      const timer = setTimeout(() => {
        cleanup();
        resolve(null);
      }, timeout);

      document.addEventListener('click', onClick, true);
    });
  }, timeoutMs).catch(() => null);

  if (payload) {
    metaState.steps.push(`${stepLabel} -> learned-click (${payload.selector || payload.tag || 'unknown'}) @${payload.x},${payload.y}`);
    metaState.learnedVehicleClick = payload;
    return payload;
  }

  metaState.steps.push(`${stepLabel} -> timeout-no-click`);
  return null;
}

async function clickPreferredVehicleRow(targetPage, preferredIndex, metaState, stepLabel) {
  if (!Number.isInteger(preferredIndex) || preferredIndex < 0) return false;

  const result = await targetPage.evaluate(({ index }) => {
    function isVisible(el) {
      if (!el) return false;
      const style = window.getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0;
    }

    const selectors = [
      '[role="dialog"] table tbody tr',
      '.modal table tbody tr',
      '.popup table tbody tr',
      'table tbody tr',
    ];

    for (const selector of selectors) {
      const allRows = Array.from(document.querySelectorAll(selector)).filter(isVisible);
      if (!allRows.length || index >= allRows.length) continue;

      const row = allRows[index];
      try {
        row.scrollIntoView({ block: 'center', inline: 'nearest' });
      } catch {
      }

      const actionCandidate = row.querySelector('a,button,input[type="button"],input[type="submit"],div,span');
      if (actionCandidate) {
        try {
          actionCandidate.click();
          return {
            ok: true,
            selector,
            method: 'row-action',
            text: (row.textContent || '').trim().slice(0, 140),
          };
        } catch {
        }
      }

      try {
        row.click();
        return {
          ok: true,
          selector,
          method: 'row',
          text: (row.textContent || '').trim().slice(0, 140),
        };
      } catch {
      }
    }

    return { ok: false };
  }, { index: preferredIndex }).catch(() => ({ ok: false }));

  if (result?.ok) {
    metaState.steps.push(`${stepLabel} -> preferred-row-dom index=${preferredIndex} (${result.selector}/${result.method}) ${result.text || ''}`.trim());
    return true;
  }

  metaState.steps.push(`${stepLabel} -> preferred-row-dom-miss index=${preferredIndex}`);
  return false;
}

async function selectFirstVehicleResult(page, metaState, knownPages = new Set()) {
  const context = page.context();

  for (let attempt = 0; attempt < 8; attempt++) {
    const freshPopup = context.pages().find((candidate) => !knownPages.has(candidate));
    if (freshPopup && freshPopup !== page) {
      await freshPopup.bringToFront().catch(() => null);
      await freshPopup.waitForLoadState('domcontentloaded').catch(() => null);

      const popupSelected = await (async () => {
        if (vehiclePreferredSelector) {
          const preferredLocator = freshPopup.locator(vehiclePreferredSelector).first();
          const preferredCount = await preferredLocator.count().catch(() => 0);
          if (preferredCount) {
            const preferredVisible = await preferredLocator.isVisible().catch(() => false);
            if (preferredVisible) {
              await preferredLocator.click({ timeout: 15000 }).catch(() => preferredLocator.click({ force: true, timeout: 15000 }));
              metaState.steps.push(`select-vehicle-popup -> preferred-selector (${vehiclePreferredSelector})`);
              return true;
            }
          }
        }

        if (await clickPreferredVehicleRow(freshPopup, vehicleResultIndex, metaState, 'select-vehicle-popup')) {
          return true;
        }

        const popupClicked = await clickFirstVisible([
          { name: `popup linha preferida (${vehicleResultIndex})`, locator: freshPopup.locator('table tbody tr').nth(vehicleResultIndex) },
          { name: 'popup primeira linha', locator: freshPopup.locator('table tbody tr').first() },
          { name: 'popup selecionar link', locator: freshPopup.getByRole('link', { name: /selecionar|escolher|confirmar|ok/i }) },
          { name: 'popup selecionar button', locator: freshPopup.getByRole('button', { name: /selecionar|escolher|confirmar|ok/i }) },
        ], 'select-vehicle-popup');
        if (popupClicked) return true;

        const domPopupClicked = await freshPopup.evaluate(() => {
          const row = document.querySelector('table tbody tr, table tr');
          if (row) {
            try {
              row.click();
            } catch {
            }
          }
          const action = document.querySelector('a[title*="sele" i],button[title*="sele" i],a,button,input[type="button"],input[type="submit"]');
          if (action) {
            try {
              action.click();
              return true;
            } catch {
            }
          }
          return false;
        }).catch(() => false);
        return domPopupClicked;
      })();

      if (popupSelected) {
        metaState.steps.push(`select-vehicle -> popup-page (${freshPopup.url() || 'about:blank'})`);
        await freshPopup.close().catch(() => null);
        await page.bringToFront().catch(() => null);
        await page.waitForLoadState('domcontentloaded', { timeout: vehiclePostSelectLoadWaitMs }).catch(() => null);
        await page.waitForTimeout(vehiclePostSelectWaitMs);
        return true;
      }
    }
    await page.waitForTimeout(160);
  }

  const dialogVisible = await page
    .locator('[role="dialog"], .modal, .ui-dialog, .popup, .modal-dialog, [id*="dialog" i], [class*="dialog" i]')
    .first()
    .isVisible()
    .catch(() => false);

  if (dialogVisible) {
    if (vehiclePreferredSelector) {
      const preferredDialog = page.locator(vehiclePreferredSelector).first();
      const preferredCount = await preferredDialog.count().catch(() => 0);
      if (preferredCount) {
        const preferredVisible = await preferredDialog.isVisible().catch(() => false);
        if (preferredVisible) {
          await preferredDialog.click({ timeout: 15000 }).catch(() => preferredDialog.click({ force: true, timeout: 15000 }));
          metaState.steps.push(`select-vehicle-dialog -> preferred-selector (${vehiclePreferredSelector})`);
          await page.waitForLoadState('domcontentloaded', { timeout: vehiclePostSelectLoadWaitMs }).catch(() => null);
          await page.waitForTimeout(vehiclePostSelectWaitMs);
          return true;
        }
      }
    }

    if (await clickPreferredVehicleRow(page, vehicleResultIndex, metaState, 'select-vehicle-dialog')) {
      await page.waitForLoadState('domcontentloaded', { timeout: vehiclePostSelectLoadWaitMs }).catch(() => null);
      await page.waitForTimeout(vehiclePostSelectWaitMs);
      return true;
    }

    const clickedDialog = await clickFirstVisible([
      { name: `dialog linha preferida (${vehicleResultIndex})`, locator: page.locator('[role="dialog"] table tbody tr, .modal table tbody tr, .popup table tbody tr').nth(vehicleResultIndex) },
      { name: 'dialog primeira linha', locator: page.locator('[role="dialog"] table tbody tr, .modal table tbody tr, .popup table tbody tr').first() },
      { name: 'dialog selecionar link', locator: page.locator('[role="dialog"] a, .modal a, .popup a').filter({ hasText: /selecionar|escolher|confirmar|ok/i }).first() },
      { name: 'dialog selecionar button', locator: page.locator('[role="dialog"] button, .modal button, .popup button').filter({ hasText: /selecionar|escolher|confirmar|ok/i }).first() },
    ], 'select-vehicle-dialog');

    if (clickedDialog) {
      await page.waitForLoadState('domcontentloaded', { timeout: vehiclePostSelectLoadWaitMs }).catch(() => null);
      await page.waitForTimeout(vehiclePostSelectWaitMs);
      return true;
    }
  }

  if (await clickPreferredVehicleRow(page, vehicleResultIndex, metaState, 'select-vehicle')) {
    await page.waitForLoadState('domcontentloaded', { timeout: vehiclePostSelectLoadWaitMs }).catch(() => null);
    await page.waitForTimeout(vehiclePostSelectWaitMs);
    return true;
  }

  const clickedByLocator = await clickFirstVisible([
    { name: `linha preferida tabela (${vehicleResultIndex})`, locator: page.locator('table tbody tr').nth(vehicleResultIndex) },
    { name: 'primeira linha tabela', locator: page.locator('table tbody tr').first() },
    { name: `resultado preferido genérico (${vehicleResultIndex})`, locator: page.locator('.modal table tr, .popup table tr, [role="dialog"] table tr').nth(vehicleResultIndex) },
    { name: 'primeiro resultado genérico', locator: page.locator('.modal table tr, .popup table tr, [role="dialog"] table tr').first() },
    { name: 'selecionar viatura button', locator: page.getByRole('button', { name: /selecionar|escolher|confirmar|ok/i }) },
    { name: 'selecionar viatura link', locator: page.getByRole('link', { name: /selecionar|escolher|confirmar|ok/i }) },
  ], 'select-vehicle');

  if (clickedByLocator) {
    await page.waitForLoadState('domcontentloaded', { timeout: vehiclePostSelectLoadWaitMs }).catch(() => null);
    await page.waitForTimeout(vehiclePostSelectWaitMs);
    return true;
  }

  const clickedByDom = await page.evaluate(() => {
    function isVisible(el) {
      const style = window.getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0;
    }

    const preferred = [
      ...Array.from(document.querySelectorAll('button,a,input[type="button"],input[type="submit"]')),
      ...Array.from(document.querySelectorAll('table tbody tr, .modal tr, .popup tr, [role="dialog"] tr')),
    ];

    for (const candidate of preferred) {
      if (!isVisible(candidate)) continue;
      const text = (candidate.textContent || '').trim();
      const label = `${candidate.getAttribute('title') || ''} ${candidate.getAttribute('aria-label') || ''} ${text}`.toLowerCase();
      const isAction = /selecionar|escolher|confirmar|ok|selec|choose|select/.test(label);
      const isResultRow = candidate.tagName.toLowerCase() === 'tr' && text.length > 0;
      if (!isAction && !isResultRow) continue;
      try {
        candidate.click();
        return { ok: true, label: label.slice(0, 120) };
      } catch {
      }
    }
    return { ok: false };
  });

  if (clickedByDom?.ok) {
    metaState.steps.push(`select-vehicle -> dom-fallback (${clickedByDom.label})`);
    await page.waitForLoadState('domcontentloaded', { timeout: vehiclePostSelectLoadWaitMs }).catch(() => null);
    await page.waitForTimeout(vehiclePostSelectWaitMs);
    return true;
  }

  metaState.steps.push('select-vehicle -> not-found');
  return false;
}

const browser = await chromium.launch({ headless, slowMo });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });

async function loadLatestAutoSimulationFromLocalhost() {
  const bridgePage = await browser.newPage({ viewport: { width: 1200, height: 800 } });
  try {
    await bridgePage.goto('http://localhost:5176/pt/simulacao-auto', { waitUntil: 'domcontentloaded', timeout: 12000 });
    const payloadRaw = await bridgePage.evaluate(() => localStorage.getItem('latestAutoSimulationPayload'));
    if (!payloadRaw) return null;
    const payload = JSON.parse(payloadRaw);
    return {
      id: 'localhost-localStorage',
      path: 'localStorage:latestAutoSimulationPayload',
      payload,
      raw: payload,
    };
  } catch {
    return null;
  } finally {
    await bridgePage.close();
  }
}

async function clickFirstVisible(locators, stepLabel) {
  for (const item of locators) {
    const locator = item.locator;
    const count = await locator.count().catch(() => 0);
    if (!count) continue;
    for (let index = 0; index < Math.min(count, 8); index++) {
      const candidate = locator.nth(index);
      const visible = await candidate.isVisible().catch(() => false);
      if (!visible) continue;
      try {
        await candidate.click({ timeout: 15000 });
      } catch {
        try {
          await candidate.click({ force: true, timeout: 15000 });
        } catch {
          continue;
        }
      }
      meta.steps.push(`${stepLabel} -> ${item.name} [${index}]`);
      return true;
    }
  }
  return false;
}

async function clickByTextFallback(textRegex, stepLabel) {
  const pattern = textRegex.source;
  const flags = textRegex.flags;
  const result = await page.evaluate(({ pattern, flags }) => {
    const regex = new RegExp(pattern, flags);
    const candidates = Array.from(document.querySelectorAll('a,button,div,span,li'));
    for (const el of candidates) {
      const text = (el.textContent || '').trim();
      if (!text || !regex.test(text)) continue;
      const style = window.getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      const visible = style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0;
      if (!visible) continue;
      el.click();
      return { ok: true, text };
    }
    return { ok: false };
  }, { pattern, flags });

  if (result?.ok) {
    meta.steps.push(`${stepLabel} -> fallback text click (${result.text})`);
    return true;
  }
  return false;
}

async function waitForAutoFormReady(page, timeoutMs, metaState) {
  await page
    .waitForURL((u) => /MZ_Auto\/(Dados_Auto\.aspx|Dados_Auto)/i.test(u.toString()), { timeout: timeoutMs })
    .catch(() => null);

  const readySelectors = [
    'input[name*="nif" i]',
    'input[id*="nif" i]',
    'input[name*="contrib" i]',
    'input[id*="contrib" i]',
  ];

  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    for (const selector of readySelectors) {
      const locator = page.locator(selector).first();
      const count = await locator.count().catch(() => 0);
      if (!count) continue;
      const visible = await locator.isVisible().catch(() => false);
      if (!visible) continue;
      metaState.steps.push(`simular-ready -> ${selector}`);
      return true;
    }
    await page.waitForTimeout(120);
  }

  metaState.steps.push('simular-ready -> timeout');
  return false;
}

async function waitForSimuladoresMenuReady(page, timeoutMs, metaState) {
  async function poll(ms, label) {
    const started = Date.now();
    while (Date.now() - started < ms) {
      const ready = await page
        .locator('a:has-text("Simuladores"), [role="link"]:has-text("Simuladores"), *:has-text("Simuladores")')
        .first()
        .isVisible()
        .catch(() => false);
      if (ready) {
        metaState.steps.push(`menu-simuladores-ready -> ${label}`);
        return true;
      }
      await page.waitForTimeout(120);
    }
    return false;
  }

  if (await poll(timeoutMs, 'visible')) return true;

  await page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => null);
  if (await poll(3000, 'visible-after-networkidle')) return true;

  metaState.steps.push('menu-simuladores-ready -> timeout');
  return false;
}

async function updateDebugOverlay(page, label) {
  if (!debugOverlayEnabled) return;
  const elapsedMs = Date.now() - runStartedAt;
  const text = `t+${elapsedMs}ms | ${label}`;
  await page.evaluate((overlayText) => {
    let overlay = document.getElementById('__pw_transfer_debug_overlay__');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = '__pw_transfer_debug_overlay__';
      overlay.style.position = 'fixed';
      overlay.style.right = '12px';
      overlay.style.top = '12px';
      overlay.style.zIndex = '2147483647';
      overlay.style.background = 'rgba(0,0,0,0.82)';
      overlay.style.color = '#8dff9e';
      overlay.style.fontFamily = 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace';
      overlay.style.fontSize = '12px';
      overlay.style.lineHeight = '1.3';
      overlay.style.padding = '8px 10px';
      overlay.style.borderRadius = '8px';
      overlay.style.maxWidth = '520px';
      overlay.style.pointerEvents = 'none';
      overlay.style.whiteSpace = 'normal';
      document.body.appendChild(overlay);
    }
    overlay.textContent = overlayText;
  }, text).catch(() => null);
}

async function waitForClienteContainerReady(page, timeoutMs, pollMs, metaState) {
  const selector = `#${clienteReadyElementId}`;
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    const ready = await page.evaluate((sel) => {
      const element = document.querySelector(sel);
      if (!element) return false;
      const text = (element.textContent || '').trim();
      return element.childElementCount > 0 || text.length > 0;
    }, selector).catch(() => false);

    if (ready) {
      metaState.steps.push(`cliente-ready -> ${selector}`);
      return true;
    }
    await page.waitForTimeout(pollMs);
  }

  metaState.steps.push('cliente-ready -> timeout');
  return false;
}

async function saveShot(name) {
  await page.screenshot({ path: path.join(dir, name), fullPage: false });
}

try {
  const simulationSource = preferLocalhostFirst
    ? ((await loadLatestAutoSimulationFromLocalhost().catch(() => null)) ||
      (await loadLatestAutoSimulationPayload().catch(() => null)))
    : ((await loadLatestAutoSimulationPayload().catch(() => null)) ||
      (await loadLatestAutoSimulationFromLocalhost().catch(() => null)));
  const simulationPayload = simulationSource?.payload || {};
  meta.simulationSourcePreference = preferLocalhostFirst ? 'localhost-first' : 'firestore-first';
  meta.simulationSourcePath = simulationSource?.path || null;
  meta.simulationPayloadSample = {
    matricula: simulationPayload.matricula || null,
    codigoPostal: simulationPayload.codigoPostal || null,
    marca: simulationPayload.marca || null,
    modelo: simulationPayload.modelo || null,
    ano: simulationPayload.ano || null,
  };

  await page.goto('https://myzurich.zurich.com.pt/', { waitUntil: 'domcontentloaded', timeout: 45000 });
  await updateDebugOverlay(page, 'login-page-opened');
  await page.waitForSelector('#Input_LoginUsername', { timeout: 20000 });
  await page.fill('#Input_LoginUsername', process.env.TRANSFER_LOGIN_USERNAME || '');

  await clickFirstVisible([
    { name: 'seguinte login step1', locator: page.locator('#LoginForm button[type="submit"], #LoginForm input[type="submit"], button:has-text("Seguinte")') },
  ], 'login-step1');
  await updateDebugOverlay(page, 'login-step1-submitted');

  await page.waitForLoadState('domcontentloaded', { timeout: 1200 }).catch(() => null);
  await page.waitForTimeout(loginStepTransitionMs);

  const pass = page.locator('input[type="password"], input[name*="pass" i], input[id*="pass" i]').first();
  if (await pass.count()) {
    await pass.fill(process.env.TRANSFER_LOGIN_PASSWORD || '');
    await clickFirstVisible([
      { name: 'entrar login step2', locator: page.locator('button[type="submit"], input[type="submit"], button:has-text("Entrar"), button:has-text("Login"), button:has-text("Seguinte")') },
    ], 'login-step2');
    await updateDebugOverlay(page, 'login-step2-submitted');
  }

  await page.waitForURL((u) => u.toString().includes('/MYZ_Home/Home'), { timeout: loginLandingWaitTimeoutMs }).catch(() => null);
  await page.waitForLoadState('domcontentloaded', { timeout: 1200 }).catch(() => null);
  await page.waitForTimeout(homeSettlingMs);
  await waitForSimuladoresMenuReady(page, menuSimuladoresReadyWaitMs, meta);
  await updateDebugOverlay(page, 'home-ready');
  await saveShot('01-home.png');

  let clickedMenu = await clickFirstVisible([
    { name: 'menu Simuladores link', locator: page.getByRole('link', { name: /^Simuladores$/i }) },
    { name: 'menu Simuladores any', locator: page.getByText(/Simuladores/i) },
  ], 'menu-simuladores');

  if (!clickedMenu) {
    clickedMenu = await clickByTextFallback(/Simuladores|Simulador/i, 'menu-simuladores-fallback');
  }

  if (!clickedMenu) throw new Error('Não consegui clicar no menu Simuladores');
  await updateDebugOverlay(page, 'menu-simuladores-clicked');

  await page.waitForTimeout(menuTransitionMs);

  let clickedSubmenu = await clickFirstVisible([
    { name: 'submenu Simuladores link', locator: page.getByRole('link', { name: /^Simuladores$/i }) },
    { name: 'submenu Simuladores text', locator: page.getByText(/^Simuladores$/i) },
    { name: 'submenu Simuladores any', locator: page.getByText(/Simuladores/i) },
  ], 'submenu-simuladores');

  if (!clickedSubmenu) {
    clickedSubmenu = await clickByTextFallback(/Simuladores/i, 'submenu-simuladores-fallback');
  }

  await page.waitForLoadState('networkidle', { timeout: 1800 }).catch(() => null);
  await page.waitForTimeout(simuladoresListSettlingMs);
  await saveShot('02-lista-simuladores.png');

  let clickedTile = await clickFirstVisible([
    { name: 'tile Zurich Auto exact', locator: page.getByText(/^Zurich\s*Auto$/i) },
    { name: 'tile Zurich Auto loose', locator: page.getByText(/Zurich\s*Auto/i) },
    { name: 'tile Auto fallback', locator: page.getByText(/Auto/i) },
  ], 'tile-zurich-auto');

  if (!clickedTile) {
    clickedTile = await clickByTextFallback(/Zurich\s*Auto|Auto/i, 'tile-zurich-auto-fallback');
  }

  if (!clickedTile) throw new Error('Não consegui clicar no tile Zurich Auto');
  await updateDebugOverlay(page, 'tile-zurich-auto-clicked');

  await page.waitForLoadState('networkidle', { timeout: 1800 }).catch(() => null);
  await page.waitForTimeout(tileOpenSettlingMs);
  await saveShot('03-tile-aberto.png');

  const alreadyInAutoForm = page.url().includes('/MZ_Auto/Dados_Auto.aspx');
  if (alreadyInAutoForm) {
    meta.steps.push('botao-simular -> já em Dados_Auto.aspx (último passo alcançado)');
  }

  let clickedSimular = alreadyInAutoForm;
  if (!clickedSimular) {
    clickedSimular = await clickFirstVisible([
      { name: 'botao Simular role button', locator: page.getByRole('button', { name: /^Simular$/i }) },
      { name: 'botao Simular text', locator: page.getByText(/^Simular$/i) },
      { name: 'botao Simular loose', locator: page.getByText(/Simular/i) },
      { name: 'link Simular', locator: page.getByRole('link', { name: /Simular/i }) },
    ], 'botao-simular');
  }

  if (!clickedSimular) {
    clickedSimular = await clickByTextFallback(/Simular/i, 'botao-simular-fallback');
  }

  if (!clickedSimular) throw new Error('Não consegui clicar em Simular');
  await updateDebugOverlay(page, 'simular-clicked');

  await waitForAutoFormReady(page, simularPostClickReadyTimeoutMs, meta);
  await page.waitForTimeout(firstSimularSettlingMs);
  await updateDebugOverlay(page, 'auto-form-ready');

  const contribuinteSelectors = [
    'input[name*="nif" i]',
    'input[id*="nif" i]',
    'input[name*="contrib" i]',
    'input[id*="contrib" i]',
  ];

  await fillFirstMatchingField(
    page,
    contribuinteSelectors,
    simulationPayload.contribuinte,
    'contribuinte',
    meta
  );

  await page.waitForTimeout(contribuintePostFillWaitMs);
  const personNameWatchSelectors = [
    'input[name*="nome" i]',
    'input[id*="nome" i]',
    'input[name*="tomador" i]',
    'input[id*="tomador" i]',
    'input[name*="cliente" i]',
    'input[id*="cliente" i]',
    'input[name*="segurado" i]',
    'input[id*="segurado" i]',
    'span[id*="nome" i]',
    'div[id*="nome" i]',
  ];
  const nameBaseline = await snapshotValues(page, personNameWatchSelectors);
  const clickedContribLookup = await clickLookupNearField(page, contribuinteSelectors, 'contribuinte', meta);
  if (!clickedContribLookup) {
    throw new Error('Não foi possível clicar na lupa do contribuinte');
  }
  await updateDebugOverlay(page, 'nif-lookup-clicked');
  const clienteReady = await waitForClienteContainerReady(
    page,
    clienteReadyWaitTimeoutMs,
    clienteReadyPollMs,
    meta
  );
  if (clienteReady) {
    await updateDebugOverlay(page, 'cliente-ready -> avançar matrícula');
  }

  let nameResolved = clienteReady;
  if (!nameResolved) {
    await page.waitForTimeout(contribuintePostLookupWaitMs);
    nameResolved = await waitForValueAppearance(
      page,
      personNameWatchSelectors,
      nameBaseline,
      contribuinteNameWaitTimeoutMs,
      'contribuinte-name-loaded',
      meta,
      { allowExistingNonEmpty: true, pollIntervalMs: contribuinteNamePollMs }
    );
  }
  if (!nameResolved) {
    throw new Error('Nome da pessoa não apareceu após lookup do contribuinte');
  }

  const matriculaSelectors = [
    'input[name*="matric" i]',
    'input[id*="matric" i]',
    'input[placeholder*="matr" i]',
    'input[name*="plate" i]',
    'input[id*="plate" i]',
  ];
  const vehicleWatchSelectors = [
    'input[name*="marca" i]',
    'input[id*="marca" i]',
    'input[name*="modelo" i]',
    'input[id*="modelo" i]',
    'input[name*="versao" i]',
    'input[id*="versao" i]',
    'input[name*="vehicle" i]',
    'input[id*="vehicle" i]',
  ];
  let primingFocused = false;
  if (matriculaPrimingEnabled) {
    primingFocused = await forceFocusMatriculaField(
      page,
      matriculaSelectors,
      meta,
      'matricula-prefocus-priming',
      {
        focusClicks: matriculaPrimingFocusClicks,
        focusGapMs: matriculaPrimingFocusGapMs,
        initialForce: true,
        clickTimeoutMs: matriculaPrimingClickTimeoutMs,
      }
    );
  }
  const vehicleBaseline = await snapshotValues(page, vehicleWatchSelectors);
  const knownPages = new Set(page.context().pages());
  const preflightFocused = await forceFocusMatriculaField(
    page,
    matriculaSelectors,
    meta,
    'matricula-prefocus-preflight',
    {
      focusClicks: primingFocused ? 1 : Math.max(1, matriculaPreflightFocusClicks),
      focusGapMs: matriculaPreflightFocusGapMs,
      initialForce: primingFocused,
      clickTimeoutMs: primingFocused ? 900 : 15000,
    }
  );

  if (manualMatriculaAfterNif) {
    let recoveredByReclick = false;
    meta.steps.push('manual-matricula-after-nif -> aguardando utilizador inserir matrícula e clicar lupa');
    await updateDebugOverlay(page, 'AGUARDO: inserir matrícula + clicar lupa');
    if (captureMatriculaIntermediateShot) {
      await saveShot('04-matricula-antes-lupa.png');
    }

    const manualPlate = await waitForAnyFieldNonEmpty(
      page,
      matriculaSelectors,
      240000,
      'manual-matricula-filled',
      meta
    );
    if (!manualPlate.ok) {
      throw new Error('Timeout: matrícula não foi inserida manualmente');
    }
    await updateDebugOverlay(page, 'matrícula preenchida manualmente');

    const manualChooser = await waitForVehicleDialogOrLoaded(
      page,
      knownPages,
      vehicleWatchSelectors,
      vehicleBaseline,
      240000,
      meta
    );
    if (!manualChooser.ok) {
      recoveredByReclick = await recoverVehicleChooserByReclickAndSelectFirst(
        page,
        knownPages,
        matriculaSelectors,
        meta,
        'manual-after-nif-recovery'
      );
      if (!recoveredByReclick) {
        throw new Error('Timeout: após inserires matrícula e clicares na lupa não apareceu diálogo/lista de viaturas');
      }
    }
    await updateDebugOverlay(page, 'diálogo/lista viaturas detetado');

    if (!recoveredByReclick && (manualChooser.mode === 'popup' || manualChooser.mode === 'dialog')) {
      if (manualSelectVehicleFirst) {
        const manualSelected = await waitForManualVehicleSelection(
          page,
          knownPages,
          vehicleWatchSelectors,
          vehicleBaseline,
          manualSelectVehicleTimeoutMs,
          meta,
          {
            matriculaSelectors,
            reopenAttempts: manualSelectVehicleReopenAttempts,
            reopenWaitMs: manualSelectVehicleReopenWaitMs,
            learnVehicleClick: manualLearnVehicleClick,
          }
        );
        if (!manualSelected.ok) {
          throw new Error('Timeout: lista de viaturas aberta, mas não houve seleção manual a tempo');
        }
      } else {
        let selectedVehicle = await selectFirstVehicleResult(page, meta, knownPages);
        if (!selectedVehicle && forceRecoveryReclickInAutoMode) {
          recoveredByReclick = await recoverVehicleChooserByReclickAndSelectFirst(
            page,
            knownPages,
            matriculaSelectors,
            meta,
            'forced-recovery-auto'
          );
        }
        if (recoveredByReclick) {
          meta.steps.push('select-vehicle -> skipped (already selected by forced recovery auto)');
        } else {
          if (!selectedVehicle) {
            throw new Error('Não foi possível selecionar uma viatura após o teu clique na lupa da matrícula');
          }
          meta.steps.push(`auto-select-vehicle-pause -> ${pauseAfterAutoSelectVehicleMs}ms`);
          await page.waitForTimeout(pauseAfterAutoSelectVehicleMs);
        }
      }
    }
  } else {
    let recoveredByReclick = false;
    await forceFocusMatriculaField(
      page,
      matriculaSelectors,
      meta,
      'matricula-prefocus-early',
      {
        focusClicks: preflightFocused ? matriculaPostPreflightFocusClicks : matriculaFieldFocusClicks,
        focusGapMs: matriculaFieldFocusClickGapMs,
        initialForce: preflightFocused,
        clickTimeoutMs: preflightFocused ? 1200 : 15000,
      }
    );
    await page.waitForTimeout(2000);
    const typedMatricula = await typeMatriculaProgressively(page, matriculaSelectors, simulationPayload.matricula, meta, { skipInitialFocus: true });
    if (!typedMatricula) {
      await fillFirstMatchingField(
        page,
        matriculaSelectors,
        simulationPayload.matricula,
        'matricula',
        meta
      );
    }

    await page.waitForTimeout(150);
    await clickOutsideField(page, matriculaSelectors, meta);
    await page.waitForTimeout(matriculaPostBlurPauseMs);

    const matriculaVisible = await waitForAnyFieldNonEmpty(
      page,
      matriculaSelectors,
      5000,
      'matricula-visible-before-lookup',
      meta
    );
    if (!matriculaVisible.ok) {
      meta.steps.push('matricula-visible-before-lookup-soft-timeout -> continuar');
    }

    await page.waitForTimeout(matriculaPreLookupPauseMs);
    if (captureMatriculaIntermediateShot) {
      await saveShot('04-matricula-antes-lupa.png');
    }

    let chooser = await waitForVehicleChooser(page, knownPages, matriculaAutoDialogInitialWaitMs, meta);
    if (!chooser.ok) {
      meta.steps.push('vehicle-dialog-auto-open -> not-detected, clicar lupa imediata');
      let clickedVehicleLookup = false;
      for (let attempt = 1; attempt <= matriculaLookupClicks && !chooser.ok; attempt++) {
        meta.steps.push(`lookup matricula -> attempt ${attempt}/${matriculaLookupClicks}`);

        if (manualMatriculaCapture && attempt === 1) {
          meta.steps.push('manual-capture-matricula-lupa -> aguardando clique do utilizador');
          await page.waitForTimeout(manualCaptureArmingMs);
          meta.manualMatriculaLookupClick = await captureSingleUserClick(page, 'lookup matricula', meta);
          clickedVehicleLookup = true;
        } else if (effectiveMatriculaLupaSelector) {
          const stepLabel = attempt === 1 ? 'lookup matricula' : `lookup matricula retry-${attempt}`;
          clickedVehicleLookup = await clickForcedSelector(page, effectiveMatriculaLupaSelector, stepLabel, meta);
          if (!clickedVehicleLookup) {
            meta.steps.push(`lookup matricula -> forced-selector-not-available (${effectiveMatriculaLupaSelector})`);
            clickedVehicleLookup = await clickLookupNearField(page, matriculaSelectors, attempt === 1 ? 'matricula' : `matricula-retry-${attempt}`, meta);
          }
        } else {
          clickedVehicleLookup = await clickLookupNearField(page, matriculaSelectors, attempt === 1 ? 'matricula' : `matricula-retry-${attempt}`, meta);
        }

        if (!clickedVehicleLookup) {
          continue;
        }

        await page.waitForTimeout(attempt === 1 ? matriculaLookupWaitFirstMs : matriculaLookupWaitRetryMs);
        chooser = await waitForVehicleChooser(page, knownPages, vehicleChooserPostLookupWaitMs, meta);
      }

      if (!clickedVehicleLookup) {
        throw new Error('Não foi possível clicar na lupa da matrícula');
      }

      if (!chooser.ok) {
        recoveredByReclick = await recoverVehicleChooserByReclickAndSelectFirst(
          page,
          knownPages,
          matriculaSelectors,
          meta,
          'auto-flow-recovery'
        );
        if (!recoveredByReclick) {
          throw new Error('Após clicar na lupa da matrícula não apareceu diálogo/lista de viaturas');
        }
      }
    } else {
      meta.steps.push('vehicle-dialog-auto-open -> detected');
    }

    if (recoveredByReclick) {
      meta.steps.push('select-vehicle -> skipped (already selected by recovery)');
    } else if (manualSelectVehicleFirst) {
      const manualSelected = await waitForManualVehicleSelection(
        page,
        knownPages,
        vehicleWatchSelectors,
        vehicleBaseline,
        manualSelectVehicleTimeoutMs,
        meta,
        {
          matriculaSelectors,
          reopenAttempts: manualSelectVehicleReopenAttempts,
          reopenWaitMs: manualSelectVehicleReopenWaitMs,
          learnVehicleClick: manualLearnVehicleClick,
        }
      );
      if (!manualSelected.ok) {
        throw new Error('Timeout: lista de viaturas aberta, mas não houve seleção manual a tempo');
      }
    } else {
      let selectedVehicle = await selectFirstVehicleResult(page, meta, knownPages);
      if (!selectedVehicle && forceRecoveryReclickInAutoMode) {
        recoveredByReclick = await recoverVehicleChooserByReclickAndSelectFirst(
          page,
          knownPages,
          matriculaSelectors,
          meta,
          'forced-recovery-auto'
        );
      }
      if (recoveredByReclick) {
        meta.steps.push('select-vehicle -> skipped (already selected by forced recovery auto)');
      } else {
        if (!selectedVehicle) {
          throw new Error('Não foi possível selecionar uma viatura após abrir lista de viaturas');
        }
        meta.steps.push(`auto-select-vehicle-pause -> ${pauseAfterAutoSelectVehicleMs}ms`);
        await page.waitForTimeout(pauseAfterAutoSelectVehicleMs);
      }
    }
    if (skipVehicleLoadedWait) {
      meta.steps.push('vehicle-loaded -> skipped');
    } else {
      await page.waitForTimeout(vehiclePostSelectWaitMs);
      const vehicleResolved = await waitForValueAppearance(
        page,
        vehicleWatchSelectors,
        vehicleBaseline,
        vehicleLoadedWaitTimeoutMs,
        'vehicle-loaded',
        meta,
        { allowExistingNonEmpty: true }
      );
      if (!vehicleResolved) {
        meta.steps.push('vehicle-loaded-soft-timeout -> sem mudança visível, continuar');
        await page.waitForTimeout(vehicleLoadedSoftPauseMs);
      }
    }
  }

  await fillFirstMatchingField(
    page,
    [
      'input[name*="postal" i]',
      'input[id*="postal" i]',
      'input[name*="codigo" i]',
      'input[id*="codigo" i]',
      'input[placeholder*="postal" i]',
    ],
    simulationPayload.codigoPostal,
    'codigoPostal',
    meta
  );

  await fillFirstMatchingField(
    page,
    [
      'input[name*="email" i]',
      'input[id*="email" i]',
      'input[type="email"]',
    ],
    simulationPayload.email,
    'email',
    meta
  );

  await fillFirstMatchingField(
    page,
    [
      'input[name*="nome" i]',
      'input[id*="nome" i]',
      'input[name*="name" i]',
      'input[id*="name" i]',
    ],
    simulationPayload.nome,
    'nome',
    meta
  );

  await page.waitForTimeout(1200);

  const finalShot = path.join(dir, '99-ultimo-passo-simular.png');
  await page.screenshot({ path: finalShot, fullPage: false });

  meta.finalUrl = page.url();
  meta.finalTitle = await page.title();
  meta.finalScreenshot = finalShot;
  meta.bodyTextSample = (await page.locator('body').innerText().catch(() => '')).slice(0, 700);

  await fs.writeFile(path.join(dir, 'meta.json'), JSON.stringify(meta, null, 2), 'utf8');

  console.log(JSON.stringify({ ok: true, dir, finalScreenshot: finalShot, finalUrl: meta.finalUrl }, null, 2));
} catch (error) {
  const errShot = path.join(dir, 'error.png');
  await page.screenshot({ path: errShot, fullPage: false }).catch(() => null);
  meta.error = error instanceof Error ? error.message : String(error);
  meta.finalUrl = page.url();
  meta.errorScreenshot = errShot;
  await fs.writeFile(path.join(dir, 'meta.json'), JSON.stringify(meta, null, 2), 'utf8');
  console.log(JSON.stringify({ ok: false, dir, error: meta.error, errorScreenshot: errShot, finalUrl: meta.finalUrl }, null, 2));
  process.exitCode = 1;
} finally {
  await browser.close();
}
