import type { Course } from '../types'

export const courses: Course[] = [

  // ====================================================================
  //  GRADE 5 MATH — FULL CURRICULUM
  // ====================================================================
  {
    id: 'math-5',
    subject: 'math',
    grade: 5,
    name: 'Math',
    icon: '🔢',
    color: '#1865f2',
    topics: [

      // ── Unit 1: Decimal Place Value ──
      {
        id: 'decimal-place-5',
        name: 'Decimal Place Value',
        description: 'Comparing, rounding, and understanding decimal places',
        icon: '📍',
        questionTemplates: [
          {
            id: 'dpv-compare', type: 'numeric',
            questionTemplate: 'Which is greater, {{a}} or {{b}}? (Enter the number)',
            variables: {
              a: { type: 'pool', pool: [3.45, 3.54, 12.09, 12.9, 0.72, 0.702, 5.6, 5.06, 8.125, 8.15, 0.4, 0.40, 7.8, 7.08] },
              b: { type: 'pool', pool: [3.45, 3.54, 12.09, 12.9, 0.72, 0.702, 5.6, 5.06, 8.125, 8.15, 0.4, 0.40, 7.8, 7.08] },
            },
            answerExpression: 'Math.max(a, b)', baseDifficulty: 0.25, tags: ['compare'],
          },
          {
            id: 'dpv-round-tenth', type: 'numeric',
            questionTemplate: 'Round {{a}} to the nearest tenth.',
            variables: {
              a: { type: 'pool', pool: [3.14, 5.67, 8.95, 12.34, 0.78, 6.05, 9.99, 2.55, 7.82, 14.36, 11.44, 0.97] },
            },
            answerExpression: 'round(a, 1)', baseDifficulty: 0.3, tags: ['rounding'],
          },
          {
            id: 'dpv-round-whole', type: 'numeric',
            questionTemplate: 'Round {{a}} to the nearest whole number.',
            variables: {
              a: { type: 'pool', pool: [3.4, 7.5, 12.8, 0.6, 9.3, 15.5, 24.1, 99.9, 45.5, 68.2] },
            },
            answerExpression: 'Math.round(a)', baseDifficulty: 0.2, tags: ['rounding'],
          },
          {
            id: 'dpv-place-value', type: 'numeric',
            questionTemplate: 'In the number {{n}}, what digit is in the {{place}} place?',
            variables: {
              n: { type: 'pool', pool: [34.567, 12.345, 98.012, 56.789, 0.456, 7.890, 23.105] },
              place: { type: 'pool', pool: ['tenths', 'hundredths', 'ones', 'tens'] },
            },
            answerExpression: 'place === "tens" ? Math.floor(n / 10) % 10 : place === "ones" ? Math.floor(n) % 10 : place === "tenths" ? Math.floor(n * 10) % 10 : Math.floor(n * 100) % 10',
            baseDifficulty: 0.35, tags: ['place-value'],
          },
        ],
      },

      // ── Unit 2-3: Add & Subtract Decimals ──
      {
        id: 'add-sub-dec-5',
        name: 'Add & Subtract Decimals',
        description: 'Adding and subtracting decimals through hundredths',
        icon: '➕',
        questionTemplates: [
          {
            id: 'dec-add-tenth', type: 'numeric',
            questionTemplate: 'What is {{a}} + {{b}}?',
            variables: {
              a: { type: 'pool', pool: [3.4, 5.7, 8.9, 12.3, 0.8, 6.1, 9.5, 15.2, 24.6, 33.8] },
              b: { type: 'pool', pool: [2.6, 4.3, 7.1, 1.5, 8.2, 3.9, 5.5, 0.7, 11.4, 6.8] },
            },
            answerExpression: 'round(a + b, 1)', baseDifficulty: 0.25, tags: ['add-tenths'],
          },
          {
            id: 'dec-add-hundredth', type: 'numeric',
            questionTemplate: 'What is {{a}} + {{b}}?',
            variables: {
              a: { type: 'pool', pool: [3.25, 5.75, 8.50, 12.45, 0.85, 6.15, 9.35, 15.60, 24.75, 33.80] },
              b: { type: 'pool', pool: [2.50, 4.25, 7.75, 1.50, 8.25, 3.50, 5.75, 0.75, 11.25, 6.50] },
            },
            answerExpression: 'round(a + b, 2)', baseDifficulty: 0.35, tags: ['add-hundredths'],
          },
          {
            id: 'dec-sub-tenth', type: 'numeric',
            questionTemplate: 'What is {{a}} − {{b}}?',
            variables: {
              a: { type: 'pool', pool: [10.5, 15.8, 20.3, 25.6, 30.9, 45.2, 50.7, 75.4, 99.1] },
              b: { type: 'pool', pool: [3.2, 5.4, 7.6, 2.8, 9.1, 4.5, 8.3, 1.7, 6.9] },
            },
            answerExpression: 'round(a - b, 1)', baseDifficulty: 0.3, tags: ['sub-tenths'],
          },
          {
            id: 'dec-sub-hundredth', type: 'numeric',
            questionTemplate: 'What is {{a}} − {{b}}?',
            variables: {
              a: { type: 'pool', pool: [10.50, 15.75, 20.25, 25.50, 30.00, 45.75, 50.25, 75.50, 100.00] },
              b: { type: 'pool', pool: [3.25, 5.50, 7.75, 2.25, 9.50, 4.75, 8.25, 1.50, 6.75] },
            },
            answerExpression: 'round(a - b, 2)', baseDifficulty: 0.4, tags: ['sub-hundredths'],
          },
          {
            id: 'dec-word-money', type: 'numeric',
            questionTemplate: 'You have ${{a}}. You spend ${{b}} on lunch. How much do you have left?',
            variables: {
              a: { type: 'pool', pool: [10, 20, 25, 50] },
              b: { type: 'pool', pool: [3.50, 4.25, 5.75, 6.50, 7.25, 8.50, 9.75, 12.25, 14.50] },
            },
            answerExpression: 'round(a - b, 2)', baseDifficulty: 0.35, tags: ['word-problem'],
          },
        ],
      },

      // ── Unit 4: Add & Subtract Fractions ──
      {
        id: 'add-sub-frac-5',
        name: 'Add & Subtract Fractions',
        description: 'Unlike denominators and mixed numbers',
        icon: '🍕',
        questionTemplates: [
          {
            id: 'frac-add-unlike', type: 'numeric',
            questionTemplate: 'What is {{a}}/{{b}} + {{c}}/{{d}}? (Simplify)',
            variables: {
              a: { type: 'range', min: 1, max: 5 },
              b: { type: 'pool', pool: [2, 3, 4, 5, 6, 8, 10, 12] },
              c: { type: 'range', min: 1, max: 5 },
              d: { type: 'pool', pool: [2, 3, 4, 5, 6, 8, 10, 12] },
            },
            answerExpression: 'simplifyFraction(a * d + c * b, b * d)', baseDifficulty: 0.4, tags: ['add-unlike'],
            visual: { type: 'fraction_bar', denominator: 'b' },
          },
          {
            id: 'frac-sub-unlike', type: 'numeric',
            questionTemplate: 'What is {{a}}/{{b}} − {{c}}/{{d}}? (Simplify)',
            variables: {
              a: { type: 'range', min: 3, max: 7 },
              b: { type: 'pool', pool: [3, 4, 5, 6, 8] },
              c: { type: 'range', min: 1, max: 3 },
              d: { type: 'pool', pool: [3, 4, 5, 6, 8] },
            },
            answerExpression: 'simplifyFraction(a * d - c * b, b * d)', baseDifficulty: 0.45, tags: ['sub-unlike'],
          },
          {
            id: 'frac-add-same', type: 'numeric',
            questionTemplate: 'What is {{a}}/{{d}} + {{b}}/{{d}}? (Simplify)',
            variables: {
              a: { type: 'range', min: 1, max: 7 },
              b: { type: 'range', min: 1, max: 7 },
              d: { type: 'pool', pool: [3, 4, 5, 6, 8, 9, 10, 12] },
            },
            answerExpression: 'simplifyFraction(a + b, d)', baseDifficulty: 0.25, tags: ['add-same'],
            visual: { type: 'fraction_bar', denominator: 'd' },
          },
          {
            id: 'frac-word-add', type: 'numeric',
            questionTemplate: 'Sarah ate {{a}}/{{b}} of a pizza. Tom ate {{c}}/{{d}} of the same pizza. How much did they eat in total? (Simplify)',
            variables: {
              a: { type: 'range', min: 1, max: 3 },
              b: { type: 'pool', pool: [4, 6, 8] },
              c: { type: 'range', min: 1, max: 3 },
              d: { type: 'pool', pool: [4, 6, 8] },
            },
            answerExpression: 'simplifyFraction(a * d + c * b, b * d)', baseDifficulty: 0.45, tags: ['word-problem'],
          },
        ],
      },

      // ── Unit 5: Multi-digit Multiplication & Division ──
      {
        id: 'multi-digit-5',
        name: 'Multi-digit Multiply & Divide',
        description: 'Multi-digit multiplication and division with whole numbers',
        icon: '✖️',
        questionTemplates: [
          {
            id: 'md-mult-2x1', type: 'numeric',
            questionTemplate: 'What is {{a}} × {{b}}?',
            variables: { a: { type: 'range', min: 12, max: 99 }, b: { type: 'range', min: 2, max: 9 } },
            answerExpression: 'a * b', baseDifficulty: 0.3, tags: ['multiplication'],
          },
          {
            id: 'md-mult-2x2', type: 'numeric',
            questionTemplate: 'What is {{a}} × {{b}}?',
            variables: { a: { type: 'range', min: 11, max: 50 }, b: { type: 'range', min: 11, max: 30 } },
            answerExpression: 'a * b', baseDifficulty: 0.5, tags: ['multiplication'],
          },
          {
            id: 'md-div-clean', type: 'numeric',
            questionTemplate: 'What is {{p}} ÷ {{b}}?',
            variables: {
              b: { type: 'pool', pool: [3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15] },
              p: { type: 'pool', pool: [36, 48, 60, 72, 84, 96, 108, 120, 132, 144, 156, 168, 180, 192, 210, 240, 252, 270, 288, 300, 360, 420, 480, 540, 600, 720] },
            },
            answerExpression: 'p / b', baseDifficulty: 0.4, tags: ['division'],
          },
          {
            id: 'md-word-mult', type: 'numeric',
            questionTemplate: 'A school ordered {{a}} boxes of pencils. Each box has {{b}} pencils. How many pencils in total?',
            variables: { a: { type: 'range', min: 12, max: 36 }, b: { type: 'pool', pool: [12, 24, 36, 48] } },
            answerExpression: 'a * b', baseDifficulty: 0.4, tags: ['word-problem'],
          },
          {
            id: 'md-word-div', type: 'numeric',
            questionTemplate: '{{total}} students are split equally into {{g}} groups. How many students per group?',
            variables: {
              g: { type: 'pool', pool: [3, 4, 5, 6, 7, 8] },
              total: { type: 'pool', pool: [24, 30, 36, 42, 48, 56, 60, 72, 84, 96, 108, 120] },
            },
            answerExpression: 'total / g', baseDifficulty: 0.35, tags: ['word-problem'],
          },
        ],
      },

      // ── Unit 6: Multiply Fractions ──
      {
        id: 'mult-frac-5',
        name: 'Multiply Fractions',
        description: 'Multiply fractions, mixed numbers, and area with fraction sides',
        icon: '🔢',
        questionTemplates: [
          {
            id: 'mf-frac-whole', type: 'numeric',
            questionTemplate: 'What is {{a}}/{{b}} × {{c}}? (Simplify)',
            variables: { a: { type: 'range', min: 1, max: 7 }, b: { type: 'pool', pool: [2, 3, 4, 5, 6, 8] }, c: { type: 'range', min: 2, max: 8 } },
            answerExpression: 'simplifyFraction(a * c, b)', baseDifficulty: 0.35, tags: ['frac-x-whole'],
          },
          {
            id: 'mf-frac-frac', type: 'numeric',
            questionTemplate: 'What is {{a}}/{{b}} × {{c}}/{{d}}? (Simplify)',
            variables: { a: { type: 'range', min: 1, max: 7 }, b: { type: 'pool', pool: [2, 3, 4, 5, 6, 8] }, c: { type: 'range', min: 1, max: 7 }, d: { type: 'pool', pool: [2, 3, 4, 5, 6, 8] } },
            answerExpression: 'simplifyFraction(a * c, b * d)', baseDifficulty: 0.45, tags: ['frac-x-frac'],
          },
          {
            id: 'mf-area', type: 'numeric',
            questionTemplate: 'A rectangle has length {{a}}/{{b}} and width {{c}}/{{d}}. What is its area? (Simplify)',
            variables: { a: { type: 'range', min: 1, max: 5 }, b: { type: 'pool', pool: [2, 3, 4] }, c: { type: 'range', min: 1, max: 5 }, d: { type: 'pool', pool: [2, 3, 4] } },
            answerExpression: 'simplifyFraction(a * c, b * d)', baseDifficulty: 0.5, tags: ['area'],
            visual: { type: 'area_grid', widthVar: 'b', heightVar: 'd' },
          },
          {
            id: 'mf-word', type: 'numeric',
            questionTemplate: 'A garden is {{a}}/{{b}} of an acre. You plant flowers on {{c}}/{{d}} of the garden. What fraction of an acre has flowers? (Simplify)',
            variables: { a: { type: 'range', min: 1, max: 3 }, b: { type: 'pool', pool: [2, 3, 4] }, c: { type: 'range', min: 1, max: 3 }, d: { type: 'pool', pool: [2, 3, 4, 5] } },
            answerExpression: 'simplifyFraction(a * c, b * d)', baseDifficulty: 0.5, tags: ['word-problem'],
          },
        ],
      },

      // ── Unit 7: Divide Fractions ──
      {
        id: 'div-frac-5',
        name: 'Divide Fractions',
        description: 'Dividing fractions and whole numbers',
        icon: '➗',
        questionTemplates: [
          {
            id: 'df-unit-by-whole', type: 'numeric',
            questionTemplate: 'What is 1/{{b}} ÷ {{c}}? (Simplify)',
            variables: { b: { type: 'pool', pool: [2, 3, 4, 5, 6, 8] }, c: { type: 'range', min: 2, max: 6 } },
            answerExpression: 'simplifyFraction(1, b * c)', baseDifficulty: 0.4, tags: ['unit-frac-div'],
          },
          {
            id: 'df-whole-by-unit', type: 'numeric',
            questionTemplate: 'What is {{a}} ÷ 1/{{b}}?',
            variables: { a: { type: 'range', min: 2, max: 8 }, b: { type: 'pool', pool: [2, 3, 4, 5, 6] } },
            answerExpression: 'a * b', baseDifficulty: 0.4, tags: ['whole-div-frac'],
          },
          {
            id: 'df-word', type: 'numeric',
            questionTemplate: 'You have {{a}} cups of trail mix. Each bag holds 1/{{b}} cup. How many bags can you fill?',
            variables: { a: { type: 'range', min: 2, max: 6 }, b: { type: 'pool', pool: [2, 3, 4, 5] } },
            answerExpression: 'a * b', baseDifficulty: 0.45, tags: ['word-problem'],
          },
        ],
      },

      // ── Unit 8: Multiply Decimals ──
      {
        id: 'mult-dec-5',
        name: 'Multiply Decimals',
        description: 'Multiplying decimals and whole numbers, and decimals by decimals',
        icon: '💲',
        questionTemplates: [
          {
            id: 'mdec-x-whole', type: 'numeric',
            questionTemplate: 'What is {{a}} × {{b}}?',
            variables: {
              a: { type: 'pool', pool: [0.5, 1.5, 2.5, 3.5, 4.5, 0.25, 0.75, 1.25, 1.75, 2.25] },
              b: { type: 'pool', pool: [2, 3, 4, 5, 6, 8, 10, 12] },
            },
            answerExpression: 'a * b', baseDifficulty: 0.35, tags: ['dec-x-whole'],
          },
          {
            id: 'mdec-x-dec', type: 'numeric',
            questionTemplate: 'What is {{a}} × {{b}}?',
            variables: {
              a: { type: 'pool', pool: [0.5, 1.5, 2.5, 0.4, 0.8, 1.2, 2.4, 3.6] },
              b: { type: 'pool', pool: [0.5, 1.5, 2.5, 0.4, 0.8, 1.2, 2, 4, 5] },
            },
            answerExpression: 'round(a * b, 2)', baseDifficulty: 0.5, tags: ['dec-x-dec'],
          },
          {
            id: 'mdec-word', type: 'numeric',
            questionTemplate: 'Apples cost ${{price}} each. You buy {{n}}. What is the total cost?',
            variables: {
              price: { type: 'pool', pool: [0.50, 0.75, 1.25, 1.50, 2.25, 2.50, 3.75] },
              n: { type: 'pool', pool: [2, 3, 4, 5, 6, 8, 10, 12] },
            },
            answerExpression: 'round(price * n, 2)', baseDifficulty: 0.4, tags: ['word-problem'],
          },
        ],
      },

      // ── Unit 9: Divide Decimals ──
      {
        id: 'div-dec-5',
        name: 'Divide Decimals',
        description: 'Dividing decimals and whole numbers',
        icon: '📏',
        questionTemplates: [
          {
            id: 'ddec-whole-dec', type: 'numeric',
            questionTemplate: 'What is {{a}} ÷ {{b}}?',
            variables: {
              a: { type: 'pool', pool: [12, 15, 18, 20, 24, 25, 30, 36, 40, 45, 48, 50, 60, 72, 75, 80, 90, 100] },
              b: { type: 'pool', pool: [2, 3, 4, 5, 6, 8, 10, 12, 15, 20, 25] },
            },
            answerExpression: 'a / b', baseDifficulty: 0.35, tags: ['whole-div'],
          },
          {
            id: 'ddec-by-tenth', type: 'numeric',
            questionTemplate: 'What is {{a}} ÷ {{b}}?',
            variables: {
              a: { type: 'pool', pool: [5, 10, 15, 20, 25, 30, 40, 50] },
              b: { type: 'pool', pool: [0.5, 0.25, 0.2, 0.1, 2.5, 1.25] },
            },
            answerExpression: 'a / b', baseDifficulty: 0.5, tags: ['div-by-decimal'],
          },
          {
            id: 'ddec-by-01', type: 'numeric',
            questionTemplate: 'What is {{a}} ÷ 0.1?',
            variables: { a: { type: 'range', min: 1, max: 50 } },
            answerExpression: 'a * 10', baseDifficulty: 0.3, tags: ['div-by-01'],
          },
          {
            id: 'ddec-by-001', type: 'numeric',
            questionTemplate: 'What is {{a}} ÷ 0.01?',
            variables: { a: { type: 'range', min: 1, max: 25 } },
            answerExpression: 'a * 100', baseDifficulty: 0.35, tags: ['div-by-001'],
          },
        ],
      },

      // ── Unit 10: Powers of Ten ──
      {
        id: 'powers-ten-5',
        name: 'Powers of Ten',
        description: 'Multiply and divide by 10, 100, 1000',
        icon: '🔟',
        questionTemplates: [
          {
            id: 'pt-mult', type: 'numeric',
            questionTemplate: 'What is {{a}} × {{p}}?',
            variables: { a: { type: 'range', min: 1, max: 50 }, p: { type: 'pool', pool: [10, 100, 1000] } },
            answerExpression: 'a * p', baseDifficulty: 0.2, tags: ['multiply'],
          },
          {
            id: 'pt-div', type: 'numeric',
            questionTemplate: 'What is {{a}} ÷ {{p}}?',
            variables: { a: { type: 'pool', pool: [10, 20, 50, 100, 200, 300, 500, 1000, 2000, 5000, 10000] }, p: { type: 'pool', pool: [10, 100, 1000] } },
            answerExpression: 'a / p', baseDifficulty: 0.25, tags: ['divide'],
          },
          {
            id: 'pt-dec-mult', type: 'numeric',
            questionTemplate: 'What is {{a}} × {{p}}?',
            variables: { a: { type: 'pool', pool: [0.5, 0.25, 1.5, 2.5, 3.75, 0.125, 4.8, 6.25, 0.04, 0.008] }, p: { type: 'pool', pool: [10, 100, 1000] } },
            answerExpression: 'a * p', baseDifficulty: 0.35, tags: ['decimal-mult'],
          },
          {
            id: 'pt-dec-div', type: 'numeric',
            questionTemplate: 'What is {{a}} ÷ {{p}}?',
            variables: { a: { type: 'pool', pool: [5, 12, 25, 50, 75, 100, 250, 500, 1000] }, p: { type: 'pool', pool: [10, 100, 1000] } },
            answerExpression: 'a / p', baseDifficulty: 0.35, tags: ['decimal-div'],
          },
        ],
      },

      // ── Unit 11: Volume ──
      {
        id: 'volume-5',
        name: 'Volume',
        description: 'Volume of rectangular prisms and composite figures',
        icon: '📦',
        questionTemplates: [
          {
            id: 'vol-rect', type: 'numeric',
            questionTemplate: 'A rectangular prism has length {{l}}, width {{w}}, and height {{h}}. What is its volume?',
            variables: { l: { type: 'range', min: 2, max: 12 }, w: { type: 'range', min: 2, max: 10 }, h: { type: 'range', min: 2, max: 8 } },
            answerExpression: 'l * w * h', baseDifficulty: 0.35, tags: ['volume'],
            visual: { type: 'shape', shape: 'rectangular_prism', labels: { l: 'l', w: 'w', h: 'h' } },
          },
          {
            id: 'vol-cube', type: 'numeric',
            questionTemplate: 'A cube has side length {{s}}. What is its volume?',
            variables: { s: { type: 'range', min: 2, max: 10 } },
            answerExpression: 's * s * s', baseDifficulty: 0.3, tags: ['volume', 'cube'],
            visual: { type: 'shape', shape: 'cube', labels: { s: 's' } },
          },
          {
            id: 'vol-base-x-h', type: 'numeric',
            questionTemplate: 'A rectangular prism has a base area of {{ba}} and height {{h}}. What is its volume?',
            variables: { ba: { type: 'pool', pool: [6, 8, 10, 12, 15, 18, 20, 24, 25, 30, 36] }, h: { type: 'range', min: 2, max: 10 } },
            answerExpression: 'ba * h', baseDifficulty: 0.35, tags: ['volume'],
            visual: { type: 'shape', shape: 'rectangular_prism', labels: { l: 'ba', w: '', h: 'h' } },
          },
          {
            id: 'vol-composite', type: 'numeric',
            questionTemplate: 'An L-shaped figure is made from two rectangular prisms: one is {{l1}}×{{w1}}×{{h}} and another is {{l2}}×{{w2}}×{{h}}. What is the total volume?',
            variables: {
              l1: { type: 'range', min: 2, max: 6 }, w1: { type: 'range', min: 2, max: 5 },
              l2: { type: 'range', min: 2, max: 6 }, w2: { type: 'range', min: 2, max: 5 },
              h: { type: 'range', min: 2, max: 5 },
            },
            answerExpression: 'l1 * w1 * h + l2 * w2 * h', baseDifficulty: 0.55, tags: ['composite'],
          },
          {
            id: 'vol-word', type: 'numeric',
            questionTemplate: 'A fish tank is {{l}} inches long, {{w}} inches wide, and {{h}} inches tall. How many cubic inches of water can it hold?',
            variables: { l: { type: 'range', min: 8, max: 20 }, w: { type: 'range', min: 5, max: 12 }, h: { type: 'range', min: 5, max: 12 } },
            answerExpression: 'l * w * h', baseDifficulty: 0.4, tags: ['word-problem'],
            visual: { type: 'shape', shape: 'rectangular_prism', labels: { l: 'l', w: 'w', h: 'h' } },
          },
        ],
      },

      // ── Unit 12: Coordinate Plane ──
      {
        id: 'coord-5',
        name: 'Coordinate Plane',
        description: 'Graphing and distance in the first quadrant',
        icon: '📊',
        questionTemplates: [
          {
            id: 'cp-dist', type: 'numeric',
            questionTemplate: 'What is the distance between ({{x1}}, {{y}}) and ({{x2}}, {{y}})?',
            variables: { x1: { type: 'range', min: 0, max: 8 }, x2: { type: 'range', min: 0, max: 8 }, y: { type: 'range', min: 0, max: 8 } },
            answerExpression: 'Math.abs(x2 - x1)', baseDifficulty: 0.3, tags: ['distance'],
            visual: { type: 'coordinate_plane', points: [{ x: 'x1', y: 'y', label: 'A' }, { x: 'x2', y: 'y', label: 'B' }] },
          },
          {
            id: 'cp-dist-v', type: 'numeric',
            questionTemplate: 'What is the distance between ({{x}}, {{y1}}) and ({{x}}, {{y2}})?',
            variables: { x: { type: 'range', min: 0, max: 8 }, y1: { type: 'range', min: 0, max: 8 }, y2: { type: 'range', min: 0, max: 8 } },
            answerExpression: 'Math.abs(y2 - y1)', baseDifficulty: 0.3, tags: ['distance'],
            visual: { type: 'coordinate_plane', points: [{ x: 'x', y: 'y1', label: 'A' }, { x: 'x', y: 'y2', label: 'B' }] },
          },
          {
            id: 'cp-word', type: 'numeric',
            questionTemplate: 'A park is at ({{x1}}, {{y1}}) and a school is at ({{x2}}, {{y1}}). If each unit is 1 block, how many blocks apart are they?',
            variables: { x1: { type: 'range', min: 1, max: 4 }, x2: { type: 'range', min: 5, max: 9 }, y1: { type: 'range', min: 1, max: 8 } },
            answerExpression: 'x2 - x1', baseDifficulty: 0.35, tags: ['word-problem'],
            visual: { type: 'coordinate_plane', points: [{ x: 'x1', y: 'y1', label: '🏞️' }, { x: 'x2', y: 'y1', label: '🏫' }] },
          },
        ],
      },

      // ── Unit 13: Algebraic Thinking ──
      {
        id: 'algebra-5',
        name: 'Algebraic Thinking',
        description: 'Expressions with parentheses and number patterns',
        icon: '🧩',
        questionTemplates: [
          {
            id: 'alg-eval-parens', type: 'numeric',
            questionTemplate: 'Evaluate: {{a}} × ({{b}} + {{c}})',
            variables: { a: { type: 'range', min: 2, max: 9 }, b: { type: 'range', min: 2, max: 12 }, c: { type: 'range', min: 2, max: 12 } },
            answerExpression: 'a * (b + c)', baseDifficulty: 0.35, tags: ['parentheses'],
          },
          {
            id: 'alg-eval-parens-2', type: 'numeric',
            questionTemplate: 'Evaluate: ({{a}} + {{b}}) × ({{c}} − {{d}})',
            variables: { a: { type: 'range', min: 2, max: 10 }, b: { type: 'range', min: 2, max: 10 }, c: { type: 'range', min: 8, max: 15 }, d: { type: 'range', min: 1, max: 7 } },
            answerExpression: '(a + b) * (c - d)', baseDifficulty: 0.5, tags: ['parentheses'],
          },
          {
            id: 'alg-pattern-next', type: 'numeric',
            questionTemplate: 'The pattern is: {{a}}, {{b}}, {{c}}, {{d}}, ... What is the next number?',
            variables: {
              a: { type: 'pool', pool: [2, 3, 5, 10] },
              b: { type: 'pool', pool: [5, 7, 10, 16] },
              c: { type: 'pool', pool: [8, 11, 15, 22] },
              d: { type: 'pool', pool: [11, 15, 20, 28] },
            },
            answerExpression: 'd + (d - c)', baseDifficulty: 0.4, tags: ['patterns'],
          },
          {
            id: 'alg-rule', type: 'numeric',
            questionTemplate: 'If the rule is "multiply by {{m}} then add {{a}}", what do you get starting from {{s}}?',
            variables: { m: { type: 'range', min: 2, max: 6 }, a: { type: 'range', min: 1, max: 10 }, s: { type: 'range', min: 1, max: 10 } },
            answerExpression: 's * m + a', baseDifficulty: 0.4, tags: ['rules'],
          },
        ],
      },

      // ── Unit 14: Converting Units ──
      {
        id: 'units-5',
        name: 'Converting Units',
        description: 'Metric and US customary unit conversions',
        icon: '📏',
        questionTemplates: [
          {
            id: 'unit-m-cm', type: 'numeric',
            questionTemplate: 'How many centimeters is {{a}} meters?',
            variables: { a: { type: 'range', min: 1, max: 25 } },
            answerExpression: 'a * 100', baseDifficulty: 0.2, tags: ['metric'],
          },
          {
            id: 'unit-km-m', type: 'numeric',
            questionTemplate: 'How many meters is {{a}} km?',
            variables: { a: { type: 'range', min: 1, max: 10 } },
            answerExpression: 'a * 1000', baseDifficulty: 0.2, tags: ['metric'],
          },
          {
            id: 'unit-kg-g', type: 'numeric',
            questionTemplate: 'How many grams is {{a}} kg?',
            variables: { a: { type: 'range', min: 1, max: 15 } },
            answerExpression: 'a * 1000', baseDifficulty: 0.2, tags: ['metric'],
          },
          {
            id: 'unit-ft-in', type: 'numeric',
            questionTemplate: 'How many inches is {{a}} feet?',
            variables: { a: { type: 'range', min: 1, max: 12 } },
            answerExpression: 'a * 12', baseDifficulty: 0.25, tags: ['customary'],
          },
          {
            id: 'unit-yd-ft', type: 'numeric',
            questionTemplate: 'How many feet is {{a}} yards?',
            variables: { a: { type: 'range', min: 1, max: 20 } },
            answerExpression: 'a * 3', baseDifficulty: 0.2, tags: ['customary'],
          },
          {
            id: 'unit-hr-min', type: 'numeric',
            questionTemplate: 'How many minutes is {{a}} hours?',
            variables: { a: { type: 'range', min: 1, max: 12 } },
            answerExpression: 'a * 60', baseDifficulty: 0.2, tags: ['time'],
          },
          {
            id: 'unit-word', type: 'numeric',
            questionTemplate: 'A race is {{a}} km long. How many meters is that?',
            variables: { a: { type: 'pool', pool: [1, 2, 3, 5, 10] } },
            answerExpression: 'a * 1000', baseDifficulty: 0.25, tags: ['word-problem'],
          },
        ],
      },

      // ── Unit 16: Properties of Shapes ──
      {
        id: 'shapes-5',
        name: 'Properties of Shapes',
        description: 'Classify triangles and quadrilaterals',
        icon: '🔺',
        questionTemplates: [
          {
            id: 'shp-tri-angles', type: 'numeric',
            questionTemplate: 'A triangle has angles {{a}}° and {{b}}°. What is the third angle?',
            variables: {
              a: { type: 'pool', pool: [30, 40, 45, 50, 55, 60, 65, 70, 75, 80, 90] },
              b: { type: 'pool', pool: [30, 35, 40, 45, 50, 55, 60, 65, 70, 80] },
            },
            answerExpression: '180 - a - b', baseDifficulty: 0.35, tags: ['triangles'],
            visual: { type: 'shape', shape: 'triangle', labels: { a: 'a', b: 'b' } },
          },
          {
            id: 'shp-quad-angles', type: 'numeric',
            questionTemplate: 'A quadrilateral has angles {{a}}°, {{b}}°, and {{c}}°. What is the fourth angle?',
            variables: {
              a: { type: 'pool', pool: [60, 70, 80, 90, 100, 110] },
              b: { type: 'pool', pool: [70, 80, 90, 100, 110, 120] },
              c: { type: 'pool', pool: [60, 70, 80, 90, 100, 110] },
            },
            answerExpression: '360 - a - b - c', baseDifficulty: 0.45, tags: ['quadrilaterals'],
          },
        ],
      },
    ],
  },

  { id: 'english-5', subject: 'english', grade: 5, name: 'English', icon: '📖', color: '#e8890c', topics: [] },
  { id: 'science-5', subject: 'science', grade: 5, name: 'Science', icon: '🔬', color: '#1b7e4f', topics: [] },

  // ====================================================================
  //  GRADE 6 MATH — FULL CURRICULUM (with visuals added)
  // ====================================================================
  {
    id: 'math-6',
    subject: 'math',
    grade: 6,
    name: 'Math',
    icon: '🔢',
    color: '#1865f2',
    topics: [

      // ── Unit 1: Ratios ──
      {
        id: 'ratios-6', name: 'Ratios', description: 'Equivalent ratios and ratio applications', icon: '⚖️',
        questionTemplates: [
          { id: 'ratio-write', type: 'numeric', questionTemplate: 'A bag has {{a}} red marbles and {{b}} blue marbles. What is the ratio of red to blue? (Simplify, a:b)', variables: { a: { type: 'pool', pool: [4,6,8,9,10,12,14,15,16,18,20,24] }, b: { type: 'pool', pool: [4,6,8,9,10,12,14,15,16,18,20,24] } }, answerExpression: 'simplifyRatio(a, b)', baseDifficulty: 0.25, tags: ['intro'] },
          { id: 'ratio-simplify', type: 'numeric', questionTemplate: 'Simplify the ratio {{a}}:{{b}}', variables: { a: { type: 'pool', pool: [6,8,10,12,14,15,16,18,20,21,24,28,30,36,40,42,48,54,60] }, b: { type: 'pool', pool: [6,8,10,12,14,15,16,18,20,21,24,28,30,36,40,42,48,54,60] } }, answerExpression: 'simplifyRatio(a, b)', baseDifficulty: 0.3, tags: ['simplify'] },
          { id: 'ratio-equiv', type: 'numeric', questionTemplate: 'Find the missing value: {{a}}:{{b}} = {{c}}:?', variables: { a: { type: 'pool', pool: [2,3,4,5,6] }, b: { type: 'pool', pool: [3,4,5,7,8,9] }, c: { type: 'pool', pool: [4,6,8,10,12,15,18,20,24,30] } }, answerExpression: '(c / a) * b', baseDifficulty: 0.4, tags: ['equivalent'] },
          { id: 'ratio-part-whole', type: 'numeric', questionTemplate: 'The ratio of boys to girls is {{a}}:{{b}}. If there are {{t}} students total, how many boys?', variables: { a: { type: 'pool', pool: [2,3,4,5] }, b: { type: 'pool', pool: [3,4,5,7] }, t: { type: 'pool', pool: [20,24,28,30,35,36,40,42,45,48,54,56,60,63,70,72,80,84,90] } }, answerExpression: '(t / (a + b)) * a', baseDifficulty: 0.5, tags: ['application'] },
          { id: 'ratio-recipe', type: 'numeric', questionTemplate: 'A recipe uses {{a}} cups of flour for every {{b}} eggs. If you use {{c}} cups of flour, how many eggs?', variables: { a: { type: 'pool', pool: [2,3,4,5] }, b: { type: 'pool', pool: [1,2,3,4] }, c: { type: 'pool', pool: [6,8,10,12,15,16,20,24,25,30] } }, answerExpression: '(c / a) * b', baseDifficulty: 0.45, tags: ['application'] },
          { id: 'ratio-triple', type: 'numeric', questionTemplate: 'The ratio of cats to dogs to birds is {{a}}:{{b}}:{{c}}. If there are {{n}} animals total, how many dogs?', variables: { a: { type: 'pool', pool: [1,2,3] }, b: { type: 'pool', pool: [2,3,4] }, c: { type: 'pool', pool: [1,2,3,5] }, n: { type: 'pool', pool: [18,21,24,27,30,36,42,48,54,60] } }, answerExpression: '(n / (a + b + c)) * b', baseDifficulty: 0.6, tags: ['three-part'] },
        ],
      },

      // ── Unit 2: Arithmetic with Rational Numbers ──
      {
        id: 'rational-arith-6', name: 'Arithmetic with Rational Numbers', description: 'Decimals, fraction division, mixed operations', icon: '🧮',
        questionTemplates: [
          { id: 'ra-dec-add', type: 'numeric', questionTemplate: 'What is {{a}} + {{b}}?', variables: { a: { type: 'pool', pool: [12.5,15.75,23.4,34.25,45.5,56.75,67.8,78.25,89.5] }, b: { type: 'pool', pool: [11.25,14.5,22.75,31.5,43.25,55.5,16.75,28.5] } }, answerExpression: 'a + b', baseDifficulty: 0.3, tags: ['decimal-add'] },
          { id: 'ra-dec-sub', type: 'numeric', questionTemplate: 'What is {{a}} − {{b}}?', variables: { a: { type: 'pool', pool: [50.5,62.75,75.25,80.5,91.75,100.25,45.5,88.75] }, b: { type: 'pool', pool: [12.25,15.5,23.75,31.25,40.5,18.75,27.25,35.5] } }, answerExpression: 'round(a - b, 2)', baseDifficulty: 0.35, tags: ['decimal-sub'] },
          { id: 'ra-dec-word', type: 'numeric', questionTemplate: 'You have ${{a}}. You buy items for ${{b}} and ${{c}}. How much is left?', variables: { a: { type: 'pool', pool: [50,75,100] }, b: { type: 'pool', pool: [12.50,15.75,18.25,22.50,27.75,31.25] }, c: { type: 'pool', pool: [8.25,10.50,13.75,15.25,19.50,21.75] } }, answerExpression: 'round(a - b - c, 2)', baseDifficulty: 0.45, tags: ['word-problem'] },
          { id: 'ra-frac-div-whole', type: 'numeric', questionTemplate: 'What is {{a}}/{{b}} ÷ {{c}}? (Simplify)', variables: { a: { type: 'range', min: 1, max: 8 }, b: { type: 'pool', pool: [2,3,4,5,6,8] }, c: { type: 'range', min: 2, max: 6 } }, answerExpression: 'simplifyFraction(a, b * c)', baseDifficulty: 0.4, tags: ['frac-div'] },
          { id: 'ra-frac-div-frac', type: 'numeric', questionTemplate: 'What is {{a}}/{{b}} ÷ {{c}}/{{d}}? (Simplify)', variables: { a: { type: 'range', min: 1, max: 9 }, b: { type: 'pool', pool: [2,3,4,5,6,7,8] }, c: { type: 'range', min: 1, max: 9 }, d: { type: 'pool', pool: [2,3,4,5,6,7,8] } }, answerExpression: 'simplifyFraction(a * d, b * c)', baseDifficulty: 0.5, tags: ['frac-div'] },
          { id: 'ra-dec-mult', type: 'numeric', questionTemplate: 'What is {{a}} × {{b}}?', variables: { a: { type: 'pool', pool: [1.5,2.5,3.5,4.5,0.5,1.2,2.4,3.6,0.25,0.75] }, b: { type: 'pool', pool: [2,4,6,8,10,12,3,5,20] } }, answerExpression: 'a * b', baseDifficulty: 0.45, tags: ['decimal-mult'] },
          { id: 'ra-whole-div', type: 'numeric', questionTemplate: 'What is {{a}} ÷ {{b}}?', variables: { a: { type: 'pool', pool: [144,120,108,96,84,72,60,48,36,168,180,210,240,252,270,288,300,360] }, b: { type: 'pool', pool: [3,4,5,6,7,8,9,10,12,15] } }, answerExpression: 'a / b', baseDifficulty: 0.4, tags: ['division'] },
          { id: 'ra-dec-div', type: 'numeric', questionTemplate: 'What is {{a}} ÷ {{b}}?', variables: { a: { type: 'pool', pool: [10,15,20,25,30,40,50,60,75,100] }, b: { type: 'pool', pool: [0.5,2.5,0.25,0.2,0.4,1.25,2,4,5] } }, answerExpression: 'a / b', baseDifficulty: 0.55, tags: ['decimal-div'] },
        ],
      },

      // ── Unit 3: Rates & Percentages ──
      {
        id: 'rates-pct-6', name: 'Rates & Percentages', description: 'Unit rates, percents, discounts, tax, tips', icon: '%',
        questionTemplates: [
          { id: 'rate-unit', type: 'numeric', questionTemplate: 'A car travels {{d}} miles in {{t}} hours. What is its speed in mph?', variables: { d: { type: 'pool', pool: [120,150,180,200,210,240,250,280,300,350,360,400,420,480,500,600] }, t: { type: 'pool', pool: [2,3,4,5,6,7,8,10] } }, answerExpression: 'd / t', baseDifficulty: 0.3, tags: ['unit-rate'] },
          { id: 'rate-price', type: 'numeric', questionTemplate: '{{a}} oz of juice costs ${{p}}. What is the price per ounce?', variables: { a: { type: 'pool', pool: [8,10,12,16,20,24,32] }, p: { type: 'pool', pool: [2.00,2.40,3.00,3.20,4.00,4.80,6.00,6.40,8.00,9.60,12.00] } }, answerExpression: 'round(p / a, 2)', baseDifficulty: 0.4, tags: ['unit-rate'] },
          { id: 'pct-of-num', type: 'numeric', questionTemplate: 'What is {{p}}% of {{n}}?', variables: { p: { type: 'pool', pool: [5,10,15,20,25,30,40,50,60,75,80,90,100,150,200] }, n: { type: 'pool', pool: [20,40,50,60,80,100,120,150,200,250,300,400,500,800,1000] } }, answerExpression: '(p / 100) * n', baseDifficulty: 0.35, tags: ['percent-of'] },
          { id: 'pct-find-pct', type: 'numeric', questionTemplate: '{{part}} is what percent of {{whole}}?', variables: { part: { type: 'pool', pool: [5,10,12,15,20,24,25,30,36,40,45,48,50,60,75,80,90,100] }, whole: { type: 'pool', pool: [20,25,40,50,60,80,100,120,150,200,250,300,400,500] } }, answerExpression: '(part / whole) * 100', baseDifficulty: 0.45, tags: ['find-percent'] },
          { id: 'pct-discount', type: 'numeric', questionTemplate: 'A jacket costs ${{price}}. It is {{p}}% off. What is the sale price?', variables: { price: { type: 'pool', pool: [20,30,40,50,60,80,100,120,150,200] }, p: { type: 'pool', pool: [10,20,25,30,40,50] } }, answerExpression: 'price - (price * p / 100)', baseDifficulty: 0.5, tags: ['discount'] },
          { id: 'pct-tax', type: 'numeric', questionTemplate: 'An item costs ${{price}}. With {{t}}% tax, what is the total?', variables: { price: { type: 'pool', pool: [10,20,25,40,50,80,100,200] }, t: { type: 'pool', pool: [5,8,10] } }, answerExpression: 'price + (price * t / 100)', baseDifficulty: 0.5, tags: ['tax'] },
          { id: 'pct-increase', type: 'numeric', questionTemplate: 'A value went from {{a}} to {{b}}. What is the percent increase?', variables: { a: { type: 'pool', pool: [20,25,40,50,60,80,100,120,150,200] }, b: { type: 'pool', pool: [25,30,50,60,75,100,125,150,180,250] } }, answerExpression: '((b - a) / a) * 100', baseDifficulty: 0.6, tags: ['percent-change'] },
          { id: 'pct-tip', type: 'numeric', questionTemplate: 'Your bill is ${{bill}}. You leave a {{p}}% tip. What is the total?', variables: { bill: { type: 'pool', pool: [20,30,40,50,60,80,100] }, p: { type: 'pool', pool: [10,15,20,25] } }, answerExpression: 'bill + (bill * p / 100)', baseDifficulty: 0.5, tags: ['tip'] },
        ],
      },

      // ── Unit 4: Exponents & Order of Operations ──
      {
        id: 'exponents-6', name: 'Exponents & Order of Operations', description: 'Powers, PEMDAS, complex expressions', icon: '⚡',
        questionTemplates: [
          { id: 'exp-sq', type: 'numeric', questionTemplate: 'What is {{a}}²?', variables: { a: { type: 'range', min: 2, max: 15 } }, answerExpression: 'a * a', baseDifficulty: 0.2, tags: ['exponents'] },
          { id: 'exp-cube', type: 'numeric', questionTemplate: 'What is {{a}}³?', variables: { a: { type: 'range', min: 2, max: 8 } }, answerExpression: 'a * a * a', baseDifficulty: 0.35, tags: ['exponents'] },
          { id: 'exp-frac', type: 'numeric', questionTemplate: 'What is ({{a}}/{{b}})²? (Simplify)', variables: { a: { type: 'range', min: 1, max: 7 }, b: { type: 'pool', pool: [2,3,4,5,6,8] } }, answerExpression: 'simplifyFraction(a * a, b * b)', baseDifficulty: 0.45, tags: ['exponent-frac'] },
          { id: 'pemdas-6a', type: 'numeric', questionTemplate: 'Solve: {{a}} + {{b}} × {{c}} − {{d}}', variables: { a: { type: 'range', min: 5, max: 25 }, b: { type: 'range', min: 2, max: 9 }, c: { type: 'range', min: 2, max: 9 }, d: { type: 'range', min: 1, max: 15 } }, answerExpression: 'a + b * c - d', baseDifficulty: 0.4, tags: ['pemdas'] },
          { id: 'pemdas-6b', type: 'numeric', questionTemplate: 'Solve: {{a}}² − {{b}} × ({{c}} + {{d}})', variables: { a: { type: 'range', min: 4, max: 10 }, b: { type: 'range', min: 2, max: 5 }, c: { type: 'range', min: 1, max: 6 }, d: { type: 'range', min: 1, max: 6 } }, answerExpression: 'a * a - b * (c + d)', baseDifficulty: 0.55, tags: ['pemdas','exponents'] },
          { id: 'pemdas-6c', type: 'numeric', questionTemplate: 'Solve: {{a}} × {{b}}² + {{c}}', variables: { a: { type: 'range', min: 2, max: 6 }, b: { type: 'range', min: 2, max: 7 }, c: { type: 'range', min: 1, max: 20 } }, answerExpression: 'a * b * b + c', baseDifficulty: 0.5, tags: ['pemdas'] },
          { id: 'pemdas-6d', type: 'numeric', questionTemplate: 'Solve: ({{a}} + {{b}})² − {{c}}', variables: { a: { type: 'range', min: 2, max: 8 }, b: { type: 'range', min: 1, max: 7 }, c: { type: 'range', min: 1, max: 30 } }, answerExpression: '(a + b) * (a + b) - c', baseDifficulty: 0.55, tags: ['pemdas','exponents'] },
        ],
      },

      // ── Unit 5: Negative Numbers ──
      {
        id: 'negatives-6', name: 'Negative Numbers', description: 'Operations with negatives and absolute value', icon: '➖',
        questionTemplates: [
          { id: 'neg-add', type: 'numeric', questionTemplate: 'What is {{a}} + ({{b}})?', variables: { a: { type: 'range', min: -50, max: 50 }, b: { type: 'range', min: -50, max: 50 } }, answerExpression: 'a + b', baseDifficulty: 0.3, tags: ['addition'], visual: { type: 'number_line', min: -10, max: 10, step: 1 } },
          { id: 'neg-sub', type: 'numeric', questionTemplate: 'What is {{a}} − ({{b}})?', variables: { a: { type: 'range', min: -40, max: 40 }, b: { type: 'range', min: -40, max: 40 } }, answerExpression: 'a - b', baseDifficulty: 0.4, tags: ['subtraction'] },
          { id: 'neg-mult', type: 'numeric', questionTemplate: 'What is {{a}} × {{b}}?', variables: { a: { type: 'range', min: -12, max: 12 }, b: { type: 'range', min: -12, max: 12 } }, answerExpression: 'a * b', baseDifficulty: 0.4, tags: ['multiplication'] },
          { id: 'neg-abs', type: 'numeric', questionTemplate: 'What is |{{a}}| + |{{b}}|?', variables: { a: { type: 'range', min: -30, max: 30 }, b: { type: 'range', min: -30, max: 30 } }, answerExpression: 'Math.abs(a) + Math.abs(b)', baseDifficulty: 0.35, tags: ['absolute-value'] },
          { id: 'neg-abs-diff', type: 'numeric', questionTemplate: 'What is |{{a}} − {{b}}|?', variables: { a: { type: 'range', min: -20, max: 20 }, b: { type: 'range', min: -20, max: 20 } }, answerExpression: 'Math.abs(a - b)', baseDifficulty: 0.45, tags: ['absolute-value'] },
          { id: 'neg-expression', type: 'numeric', questionTemplate: 'Evaluate: {{a}} × {{b}} + {{c}}', variables: { a: { type: 'range', min: -8, max: 8 }, b: { type: 'range', min: -8, max: 8 }, c: { type: 'range', min: -20, max: 20 } }, answerExpression: 'a * b + c', baseDifficulty: 0.5, tags: ['expression'] },
          { id: 'neg-temp', type: 'numeric', questionTemplate: 'The temperature is {{a}}°F. It drops {{b}} degrees. What is the new temperature?', variables: { a: { type: 'range', min: -10, max: 30 }, b: { type: 'range', min: 5, max: 40 } }, answerExpression: 'a - b', baseDifficulty: 0.35, tags: ['word-problem'] },
        ],
      },

      // ── Unit 6: Variables & Expressions ──
      {
        id: 'variables-6', name: 'Variables & Expressions', description: 'Evaluating, LCM, GCF, distributive property', icon: '🔤',
        questionTemplates: [
          { id: 'var-eval', type: 'numeric', questionTemplate: 'If x = {{x}}, what is {{a}}x + {{b}}?', variables: { x: { type: 'range', min: -8, max: 12 }, a: { type: 'range', min: 2, max: 9 }, b: { type: 'range', min: -15, max: 15 } }, answerExpression: 'a * x + b', baseDifficulty: 0.35, tags: ['evaluate'] },
          { id: 'var-eval-2', type: 'numeric', questionTemplate: 'If a = {{a}} and b = {{b}}, what is {{c}}a − {{d}}b?', variables: { a: { type: 'range', min: -6, max: 10 }, b: { type: 'range', min: -6, max: 10 }, c: { type: 'range', min: 2, max: 7 }, d: { type: 'range', min: 2, max: 7 } }, answerExpression: 'c * a - d * b', baseDifficulty: 0.45, tags: ['evaluate'] },
          { id: 'var-eval-sq', type: 'numeric', questionTemplate: 'If n = {{n}}, what is {{a}}n² + {{b}}?', variables: { n: { type: 'range', min: -5, max: 8 }, a: { type: 'range', min: 1, max: 5 }, b: { type: 'range', min: -10, max: 10 } }, answerExpression: 'a * n * n + b', baseDifficulty: 0.55, tags: ['exponents'] },
          { id: 'var-lcm', type: 'numeric', questionTemplate: 'What is the LCM of {{a}} and {{b}}?', variables: { a: { type: 'pool', pool: [2,3,4,5,6,7,8,9,10,12,14,15,16,18,20,24] }, b: { type: 'pool', pool: [2,3,4,5,6,7,8,9,10,12,14,15,16,18,20,24] } }, answerExpression: '(a * b) / gcd(a, b)', baseDifficulty: 0.4, tags: ['lcm'] },
          { id: 'var-gcf', type: 'numeric', questionTemplate: 'What is the GCF of {{a}} and {{b}}?', variables: { a: { type: 'pool', pool: [12,16,18,20,24,28,30,32,36,40,42,48,54,56,60,72] }, b: { type: 'pool', pool: [8,12,15,16,18,20,24,28,30,36,40,42,48,54,56,60] } }, answerExpression: 'gcd(a, b)', baseDifficulty: 0.4, tags: ['gcf'] },
          { id: 'var-distrib', type: 'numeric', questionTemplate: 'Expand: {{a}}({{b}}x + {{c}}). What is the coefficient of x?', variables: { a: { type: 'range', min: 2, max: 8 }, b: { type: 'range', min: 1, max: 6 }, c: { type: 'range', min: -8, max: 8 } }, answerExpression: 'a * b', baseDifficulty: 0.45, tags: ['distributive'] },
          { id: 'var-distrib-const', type: 'numeric', questionTemplate: 'Expand: {{a}}({{b}}x + {{c}}). What is the constant term?', variables: { a: { type: 'range', min: 2, max: 8 }, b: { type: 'range', min: 1, max: 6 }, c: { type: 'range', min: -8, max: 8 } }, answerExpression: 'a * c', baseDifficulty: 0.45, tags: ['distributive'] },
        ],
      },

      // ── Unit 7: Equations & Inequalities ──
      {
        id: 'equations-6', name: 'Equations & Inequalities', description: 'One-step and two-step equations', icon: '🟰',
        questionTemplates: [
          { id: 'eq-add', type: 'numeric', questionTemplate: 'Solve for x: x + {{a}} = {{b}}', variables: { a: { type: 'range', min: -20, max: 30 }, b: { type: 'range', min: -15, max: 50 } }, answerExpression: 'b - a', baseDifficulty: 0.25, tags: ['one-step'] },
          { id: 'eq-sub', type: 'numeric', questionTemplate: 'Solve for x: x − {{a}} = {{b}}', variables: { a: { type: 'range', min: -15, max: 25 }, b: { type: 'range', min: -20, max: 30 } }, answerExpression: 'b + a', baseDifficulty: 0.25, tags: ['one-step'] },
          { id: 'eq-mult', type: 'numeric', questionTemplate: 'Solve for x: {{a}}x = {{b}}', variables: { a: { type: 'pool', pool: [2,3,4,5,6,7,8,9,10,12] }, b: { type: 'pool', pool: [-60,-48,-36,-24,-18,-12,-8,-6,6,8,10,12,14,16,18,20,24,27,28,30,32,36,40,42,45,48,54,56,60,72,80,84,90,96] } }, answerExpression: 'b / a', baseDifficulty: 0.3, tags: ['one-step'] },
          { id: 'eq-div', type: 'numeric', questionTemplate: 'Solve for x: x/{{a}} = {{b}}', variables: { a: { type: 'range', min: 2, max: 10 }, b: { type: 'range', min: -8, max: 12 } }, answerExpression: 'a * b', baseDifficulty: 0.3, tags: ['one-step'] },
          { id: 'eq-two-step', type: 'numeric', questionTemplate: 'Solve for x: {{a}}x + {{b}} = {{c}}', variables: { a: { type: 'pool', pool: [2,3,4,5,6,7,8] }, b: { type: 'range', min: -12, max: 12 }, c: { type: 'pool', pool: [-20,-16,-10,-8,-4,-2,0,2,4,6,8,10,12,14,16,18,20,22,24,26,28,30,34,38,40,44,46,50] } }, answerExpression: '(c - b) / a', baseDifficulty: 0.5, tags: ['two-step'] },
          { id: 'eq-two-step-div', type: 'numeric', questionTemplate: 'Solve for x: x/{{a}} − {{b}} = {{c}}', variables: { a: { type: 'range', min: 2, max: 8 }, b: { type: 'range', min: 1, max: 10 }, c: { type: 'range', min: -5, max: 12 } }, answerExpression: '(c + b) * a', baseDifficulty: 0.5, tags: ['two-step'] },
          { id: 'eq-word', type: 'numeric', questionTemplate: 'A number multiplied by {{a}}, then increased by {{b}}, equals {{c}}. What is the number?', variables: { a: { type: 'pool', pool: [2,3,4,5,6] }, b: { type: 'range', min: 1, max: 12 }, c: { type: 'pool', pool: [11,13,14,16,17,19,20,22,23,25,26,28,29,31,32,34,35,37,38,40,41,43,44,46,47,50] } }, answerExpression: '(c - b) / a', baseDifficulty: 0.55, tags: ['word-problem'] },
        ],
      },

      // ── Unit 8: Plane Figures ──
      {
        id: 'plane-figures-6', name: 'Plane Figures', description: 'Area of 2D shapes', icon: '📐',
        questionTemplates: [
          { id: 'area-para', type: 'numeric', questionTemplate: 'A parallelogram has base {{b}} cm and height {{h}} cm. What is its area?', variables: { b: { type: 'range', min: 3, max: 20 }, h: { type: 'range', min: 3, max: 15 } }, answerExpression: 'b * h', baseDifficulty: 0.3, tags: ['parallelogram'], visual: { type: 'shape', shape: 'parallelogram', labels: { base: 'b', height: 'h' } } },
          { id: 'area-tri', type: 'numeric', questionTemplate: 'A triangle has base {{b}} cm and height {{h}} cm. What is its area?', variables: { b: { type: 'pool', pool: [4,6,8,10,12,14,16,18,20] }, h: { type: 'range', min: 3, max: 15 } }, answerExpression: '(b * h) / 2', baseDifficulty: 0.3, tags: ['triangle'], visual: { type: 'shape', shape: 'triangle', labels: { base: 'b', height: 'h' } } },
          { id: 'area-trap', type: 'numeric', questionTemplate: 'A trapezoid has parallel sides {{a}} cm and {{b}} cm, and height {{h}} cm. What is its area?', variables: { a: { type: 'pool', pool: [3,4,5,6,7,8,10,12] }, b: { type: 'pool', pool: [5,6,7,8,9,10,12,14] }, h: { type: 'pool', pool: [2,4,6,8,10] } }, answerExpression: '((a + b) * h) / 2', baseDifficulty: 0.45, tags: ['trapezoid'], visual: { type: 'shape', shape: 'trapezoid', labels: { a: 'a', b: 'b', h: 'h' } } },
          { id: 'area-composite', type: 'numeric', questionTemplate: 'An L-shape is two rectangles: {{a}}×{{b}} and {{c}}×{{d}}. Total area?', variables: { a: { type: 'range', min: 3, max: 10 }, b: { type: 'range', min: 3, max: 10 }, c: { type: 'range', min: 3, max: 10 }, d: { type: 'range', min: 3, max: 10 } }, answerExpression: 'a * b + c * d', baseDifficulty: 0.4, tags: ['composite'] },
          { id: 'area-find-h', type: 'numeric', questionTemplate: 'A triangle has area {{area}} cm² and base {{b}} cm. What is its height?', variables: { b: { type: 'pool', pool: [4,5,6,8,10,12] }, area: { type: 'pool', pool: [12,15,20,24,30,36,40,48,60] } }, answerExpression: '(2 * area) / b', baseDifficulty: 0.5, tags: ['find-dimension'], visual: { type: 'shape', shape: 'triangle', labels: { base: 'b', height: '?' } } },
        ],
      },

      // ── Unit 9: Coordinate Plane ──
      {
        id: 'coord-plane-6', name: 'Coordinate Plane', description: 'Distance and polygons', icon: '📊',
        questionTemplates: [
          { id: 'coord-dist-h', type: 'numeric', questionTemplate: 'What is the distance between ({{x1}}, {{y}}) and ({{x2}}, {{y}})?', variables: { x1: { type: 'range', min: -10, max: 10 }, x2: { type: 'range', min: -10, max: 10 }, y: { type: 'range', min: -8, max: 8 } }, answerExpression: 'Math.abs(x2 - x1)', baseDifficulty: 0.3, tags: ['distance'], visual: { type: 'coordinate_plane', points: [{ x: 'x1', y: 'y', label: 'A' }, { x: 'x2', y: 'y', label: 'B' }] } },
          { id: 'coord-dist-v', type: 'numeric', questionTemplate: 'What is the distance between ({{x}}, {{y1}}) and ({{x}}, {{y2}})?', variables: { x: { type: 'range', min: -8, max: 8 }, y1: { type: 'range', min: -10, max: 10 }, y2: { type: 'range', min: -10, max: 10 } }, answerExpression: 'Math.abs(y2 - y1)', baseDifficulty: 0.3, tags: ['distance'], visual: { type: 'coordinate_plane', points: [{ x: 'x', y: 'y1', label: 'A' }, { x: 'x', y: 'y2', label: 'B' }] } },
          { id: 'coord-perim', type: 'numeric', questionTemplate: 'A rectangle has corners at ({{x1}}, {{y1}}) and ({{x2}}, {{y2}}). Perimeter?', variables: { x1: { type: 'range', min: -8, max: 0 }, y1: { type: 'range', min: -6, max: 0 }, x2: { type: 'range', min: 1, max: 8 }, y2: { type: 'range', min: 1, max: 6 } }, answerExpression: '2 * (Math.abs(x2 - x1) + Math.abs(y2 - y1))', baseDifficulty: 0.45, tags: ['perimeter'], visual: { type: 'coordinate_plane', points: [{ x: 'x1', y: 'y1', label: '' }, { x: 'x2', y: 'y1', label: '' }, { x: 'x2', y: 'y2', label: '' }, { x: 'x1', y: 'y2', label: '' }] } },
          { id: 'coord-area-rect', type: 'numeric', questionTemplate: 'A rectangle has corners at ({{x1}}, {{y1}}) and ({{x2}}, {{y2}}). Area?', variables: { x1: { type: 'range', min: -8, max: 0 }, y1: { type: 'range', min: -6, max: 0 }, x2: { type: 'range', min: 1, max: 8 }, y2: { type: 'range', min: 1, max: 6 } }, answerExpression: 'Math.abs(x2 - x1) * Math.abs(y2 - y1)', baseDifficulty: 0.5, tags: ['area'], visual: { type: 'coordinate_plane', points: [{ x: 'x1', y: 'y1', label: '' }, { x: 'x2', y: 'y1', label: '' }, { x: 'x2', y: 'y2', label: '' }, { x: 'x1', y: 'y2', label: '' }] } },
        ],
      },

      // ── Unit 10: 3D Figures ──
      {
        id: '3d-figures-6', name: '3D Figures', description: 'Volume and surface area', icon: '📦',
        questionTemplates: [
          { id: '3d-vol-rect', type: 'numeric', questionTemplate: 'A rectangular prism is {{l}} × {{w}} × {{h}}. Volume?', variables: { l: { type: 'range', min: 2, max: 12 }, w: { type: 'range', min: 2, max: 10 }, h: { type: 'range', min: 2, max: 8 } }, answerExpression: 'l * w * h', baseDifficulty: 0.3, tags: ['volume'], visual: { type: 'shape', shape: 'rectangular_prism', labels: { l: 'l', w: 'w', h: 'h' } } },
          { id: '3d-vol-frac', type: 'numeric', questionTemplate: 'A cube has side length {{a}}/{{b}}. Volume? (Simplify)', variables: { a: { type: 'range', min: 1, max: 5 }, b: { type: 'pool', pool: [2,3,4] } }, answerExpression: 'simplifyFraction(a * a * a, b * b * b)', baseDifficulty: 0.55, tags: ['volume','fractions'], visual: { type: 'shape', shape: 'cube', labels: { s: 'a/b' } } },
          { id: '3d-sa-rect', type: 'numeric', questionTemplate: 'A box is {{l}} × {{w}} × {{h}}. Surface area?', variables: { l: { type: 'range', min: 2, max: 10 }, w: { type: 'range', min: 2, max: 8 }, h: { type: 'range', min: 2, max: 8 } }, answerExpression: '2 * (l * w + w * h + l * h)', baseDifficulty: 0.45, tags: ['surface-area'], visual: { type: 'shape', shape: 'rectangular_prism', labels: { l: 'l', w: 'w', h: 'h' } } },
          { id: '3d-sa-cube', type: 'numeric', questionTemplate: 'A cube has side length {{s}}. Surface area?', variables: { s: { type: 'range', min: 2, max: 12 } }, answerExpression: '6 * s * s', baseDifficulty: 0.3, tags: ['cube'], visual: { type: 'shape', shape: 'cube', labels: { s: 's' } } },
          { id: '3d-find-h', type: 'numeric', questionTemplate: 'A box has volume {{v}}, length {{l}}, width {{w}}. Height?', variables: { l: { type: 'pool', pool: [2,3,4,5,6] }, w: { type: 'pool', pool: [2,3,4,5,6] }, v: { type: 'pool', pool: [24,36,48,60,72,80,96,120,144,150,160,180,240,360] } }, answerExpression: 'v / (l * w)', baseDifficulty: 0.5, tags: ['find-dimension'], visual: { type: 'shape', shape: 'rectangular_prism', labels: { l: 'l', w: 'w', h: '?' } } },
        ],
      },

      // ── Unit 11: Data & Statistics ──
      {
        id: 'statistics-6', name: 'Data & Statistics', description: 'Mean, median, range', icon: '📈',
        questionTemplates: [
          { id: 'stat-mean', type: 'numeric', questionTemplate: 'Find the mean of: {{a}}, {{b}}, {{c}}, {{d}}, {{e}}', variables: { a: { type: 'pool', pool: [10,15,20,25,30,35,40,45,50,55,60,65,70,75,80,85,90] }, b: { type: 'pool', pool: [10,15,20,25,30,35,40,45,50,55,60,65,70,75,80,85,90] }, c: { type: 'pool', pool: [10,15,20,25,30,35,40,45,50,55,60,65,70,75,80,85,90] }, d: { type: 'pool', pool: [10,15,20,25,30,35,40,45,50,55,60,65,70,75,80,85,90] }, e: { type: 'pool', pool: [10,15,20,25,30,35,40,45,50,55,60,65,70,75,80,85,90] } }, answerExpression: '(a + b + c + d + e) / 5', baseDifficulty: 0.35, tags: ['mean'] },
          { id: 'stat-mean-find', type: 'numeric', questionTemplate: 'The mean of {{a}}, {{b}}, {{c}}, and x is {{m}}. What is x?', variables: { a: { type: 'range', min: 5, max: 25 }, b: { type: 'range', min: 5, max: 25 }, c: { type: 'range', min: 5, max: 25 }, m: { type: 'range', min: 10, max: 25 } }, answerExpression: '4 * m - a - b - c', baseDifficulty: 0.55, tags: ['mean'] },
          { id: 'stat-range', type: 'numeric', questionTemplate: 'Find the range of: {{a}}, {{b}}, {{c}}, {{d}}, {{e}}, {{f}}', variables: { a: { type: 'range', min: 1, max: 50 }, b: { type: 'range', min: 1, max: 50 }, c: { type: 'range', min: 1, max: 50 }, d: { type: 'range', min: 1, max: 50 }, e: { type: 'range', min: 1, max: 50 }, f: { type: 'range', min: 1, max: 50 } }, answerExpression: 'Math.max(a,b,c,d,e,f) - Math.min(a,b,c,d,e,f)', baseDifficulty: 0.3, tags: ['range'] },
        ],
      },
    ],
  },

  { id: 'english-6', subject: 'english', grade: 6, name: 'English', icon: '📖', color: '#e8890c', topics: [] },
  { id: 'science-6', subject: 'science', grade: 6, name: 'Science', icon: '🔬', color: '#1b7e4f', topics: [] },
]

export function getCoursesForGrade(grade: number): Course[] {
  return courses.filter((c) => c.grade === grade && c.topics.length > 0)
}

export function getAvailableGrades(): { grade: number; active: boolean }[] {
  return Array.from({ length: 12 }, (_, i) => ({ grade: i + 1, active: i + 1 === 5 || i + 1 === 6 }))
}

export function getCourse(courseId: string): Course | undefined {
  return courses.find((c) => c.id === courseId)
}

export function getTopic(courseId: string, topicId: string) {
  const course = getCourse(courseId)
  return course?.topics.find((t) => t.id === topicId)
}
