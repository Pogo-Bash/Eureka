import type { Course } from '../types'

export const courses: Course[] = [
  // ==================== GRADE 5 MATH ====================
  {
    id: 'math-5',
    subject: 'math',
    grade: 5,
    name: 'Math',
    icon: '🔢',
    color: '#1865f2',
    topics: [
      {
        id: 'fractions-5',
        name: 'Fractions',
        description: 'Operations with fractions and mixed numbers',
        icon: '🍕',
        questionTemplates: [
          {
            id: 'frac-add-diff-5', type: 'numeric',
            questionTemplate: 'What is {{a}}/{{b}} + {{c}}/{{d}}? (Simplify)',
            variables: { a: { type: 'range', min: 1, max: 7 }, b: { type: 'pool', pool: [3,4,5,6,8] }, c: { type: 'range', min: 1, max: 7 }, d: { type: 'pool', pool: [3,4,5,6,8] } },
            answerExpression: 'simplifyFraction(a * d + c * b, b * d)', baseDifficulty: 0.45, tags: ['addition'],
          },
          {
            id: 'frac-mult-5', type: 'numeric',
            questionTemplate: 'What is {{a}}/{{b}} × {{c}}/{{d}}? (Simplify)',
            variables: { a: { type: 'range', min: 1, max: 9 }, b: { type: 'pool', pool: [2,3,4,5,6,7,8,9] }, c: { type: 'range', min: 1, max: 9 }, d: { type: 'pool', pool: [2,3,4,5,6,7,8,9] } },
            answerExpression: 'simplifyFraction(a * c, b * d)', baseDifficulty: 0.5, tags: ['multiplication'],
          },
          {
            id: 'frac-div-5', type: 'numeric',
            questionTemplate: 'What is {{a}}/{{b}} ÷ {{c}}/{{d}}? (Simplify)',
            variables: { a: { type: 'range', min: 1, max: 8 }, b: { type: 'pool', pool: [2,3,4,5,6,8] }, c: { type: 'range', min: 1, max: 8 }, d: { type: 'pool', pool: [2,3,4,5,6,8] } },
            answerExpression: 'simplifyFraction(a * d, b * c)', baseDifficulty: 0.55, tags: ['division'],
          },
          {
            id: 'frac-word-5', type: 'numeric',
            questionTemplate: 'A recipe needs {{a}}/{{b}} cup of flour. To make {{m}} batches, how many cups? (Simplify)',
            variables: { a: { type: 'range', min: 1, max: 5 }, b: { type: 'pool', pool: [2,3,4,6,8] }, m: { type: 'range', min: 2, max: 6 } },
            answerExpression: 'simplifyFraction(a * m, b)', baseDifficulty: 0.5, tags: ['word-problem'],
          },
        ],
      },
      {
        id: 'decimals-5',
        name: 'Decimals',
        description: 'Decimal operations and conversions',
        icon: '📐',
        questionTemplates: [
          {
            id: 'dec-mult-5', type: 'numeric',
            questionTemplate: 'What is {{a}} × {{b}}?',
            variables: { a: { type: 'pool', pool: [1.5, 2.5, 3.5, 4.5, 0.5, 1.2, 2.4, 3.6, 4.8] }, b: { type: 'pool', pool: [2, 4, 6, 8, 10, 12] } },
            answerExpression: 'a * b', baseDifficulty: 0.4, tags: ['multiplication'],
          },
          {
            id: 'dec-div-5', type: 'numeric',
            questionTemplate: 'What is {{a}} ÷ {{b}}?',
            variables: { a: { type: 'pool', pool: [12, 15, 18, 24, 30, 36, 45, 48, 60, 72, 90, 100] }, b: { type: 'pool', pool: [2, 3, 4, 5, 6, 8, 10, 12, 15] } },
            answerExpression: 'a / b', baseDifficulty: 0.45, tags: ['division'],
          },
        ],
      },
      {
        id: 'order-of-ops-5',
        name: 'Order of Operations',
        description: 'PEMDAS with multi-step expressions',
        icon: '⚡',
        questionTemplates: [
          {
            id: 'pemdas-5a', type: 'numeric',
            questionTemplate: 'Solve: {{a}} + {{b}} × {{c}}',
            variables: { a: { type: 'range', min: 2, max: 20 }, b: { type: 'range', min: 2, max: 12 }, c: { type: 'range', min: 2, max: 12 } },
            answerExpression: 'a + b * c', baseDifficulty: 0.35, tags: ['pemdas'],
          },
          {
            id: 'pemdas-5b', type: 'numeric',
            questionTemplate: 'Solve: ({{a}} + {{b}}) × {{c}} − {{d}}',
            variables: { a: { type: 'range', min: 2, max: 15 }, b: { type: 'range', min: 2, max: 15 }, c: { type: 'range', min: 2, max: 8 }, d: { type: 'range', min: 1, max: 20 } },
            answerExpression: '(a + b) * c - d', baseDifficulty: 0.5, tags: ['pemdas', 'parentheses'],
          },
          {
            id: 'pemdas-5c', type: 'numeric',
            questionTemplate: 'Solve: {{a}}² + {{b}} × {{c}}',
            variables: { a: { type: 'range', min: 2, max: 9 }, b: { type: 'range', min: 2, max: 8 }, c: { type: 'range', min: 2, max: 8 } },
            answerExpression: 'a * a + b * c', baseDifficulty: 0.55, tags: ['pemdas', 'exponents'],
          },
        ],
      },
    ],
  },
  { id: 'english-5', subject: 'english', grade: 5, name: 'English', icon: '📖', color: '#e8890c', topics: [] },
  { id: 'science-5', subject: 'science', grade: 5, name: 'Science', icon: '🔬', color: '#1b7e4f', topics: [] },

  // ====================================================================
  //  GRADE 6 MATH — FULL CURRICULUM (CLEAN ANSWERS ONLY)
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
        id: 'ratios-6',
        name: 'Ratios',
        description: 'Intro to ratios, equivalent ratios, and ratio applications',
        icon: '⚖️',
        questionTemplates: [
          {
            id: 'ratio-write', type: 'numeric',
            questionTemplate: 'A bag has {{a}} red marbles and {{b}} blue marbles. What is the ratio of red to blue? (Simplify, write as a:b)',
            variables: { a: { type: 'pool', pool: [4,6,8,9,10,12,14,15,16,18,20,24] }, b: { type: 'pool', pool: [4,6,8,9,10,12,14,15,16,18,20,24] } },
            answerExpression: 'simplifyRatio(a, b)', baseDifficulty: 0.25, tags: ['intro'],
          },
          {
            id: 'ratio-simplify', type: 'numeric',
            questionTemplate: 'Simplify the ratio {{a}}:{{b}}',
            variables: { a: { type: 'pool', pool: [6,8,10,12,14,15,16,18,20,21,24,28,30,36,40,42,48,54,60] }, b: { type: 'pool', pool: [6,8,10,12,14,15,16,18,20,21,24,28,30,36,40,42,48,54,60] } },
            answerExpression: 'simplifyRatio(a, b)', baseDifficulty: 0.3, tags: ['simplify'],
          },
          {
            id: 'ratio-equiv', type: 'numeric',
            questionTemplate: 'Find the missing value: {{a}}:{{b}} = {{c}}:?',
            variables: {
              a: { type: 'pool', pool: [2,3,4,5,6] },
              b: { type: 'pool', pool: [3,4,5,7,8,9] },
              c: { type: 'pool', pool: [4,6,8,10,12,15,18,20,24,30] },
            },
            answerExpression: '(c / a) * b', baseDifficulty: 0.4, tags: ['equivalent'],
          },
          // People-safe word problems — totals are always divisible by (a+b)
          {
            id: 'ratio-part-whole', type: 'numeric',
            questionTemplate: 'The ratio of boys to girls is {{a}}:{{b}}. If there are {{t}} students total, how many boys?',
            variables: {
              a: { type: 'pool', pool: [2,3,4,5] },
              b: { type: 'pool', pool: [3,4,5,7] },
              t: { type: 'pool', pool: [20,24,28,30,35,36,40,42,45,48,54,56,60,63,70,72,80,84,90] },
            },
            answerExpression: '(t / (a + b)) * a', baseDifficulty: 0.5, tags: ['application'],
          },
          // Recipes — c always divisible by a
          {
            id: 'ratio-recipe', type: 'numeric',
            questionTemplate: 'A recipe uses {{a}} cups of flour for every {{b}} eggs. If you use {{c}} cups of flour, how many eggs do you need?',
            variables: {
              a: { type: 'pool', pool: [2,3,4,5] },
              b: { type: 'pool', pool: [1,2,3,4] },
              c: { type: 'pool', pool: [6,8,10,12,15,16,20,24,25,30] },
            },
            answerExpression: '(c / a) * b', baseDifficulty: 0.45, tags: ['application'],
          },
          // Three-part — n always divisible by (a+b+c)
          {
            id: 'ratio-triple', type: 'numeric',
            questionTemplate: 'The ratio of cats to dogs to birds is {{a}}:{{b}}:{{c}}. If there are {{n}} animals total, how many dogs?',
            variables: {
              a: { type: 'pool', pool: [1,2,3] },
              b: { type: 'pool', pool: [2,3,4] },
              c: { type: 'pool', pool: [1,2,3,5] },
              n: { type: 'pool', pool: [18,21,24,27,30,36,42,48,54,60] },
            },
            answerExpression: '(n / (a + b + c)) * b', baseDifficulty: 0.6, tags: ['three-part'],
          },
        ],
      },

      // ── Unit 2: Arithmetic with Rational Numbers ──
      {
        id: 'rational-arith-6',
        name: 'Arithmetic with Rational Numbers',
        description: 'Decimals, fraction division, and mixed operations',
        icon: '🧮',
        questionTemplates: [
          {
            id: 'ra-dec-add', type: 'numeric',
            questionTemplate: 'What is {{a}} + {{b}}?',
            variables: {
              a: { type: 'pool', pool: [12.5, 15.75, 23.4, 34.25, 45.5, 56.75, 67.8, 78.25, 89.5] },
              b: { type: 'pool', pool: [11.25, 14.5, 22.75, 31.5, 43.25, 55.5, 16.75, 28.5] },
            },
            answerExpression: 'a + b', baseDifficulty: 0.3, tags: ['decimal-add'],
          },
          {
            id: 'ra-dec-sub', type: 'numeric',
            questionTemplate: 'What is {{a}} − {{b}}?',
            variables: {
              a: { type: 'pool', pool: [50.5, 62.75, 75.25, 80.5, 91.75, 100.25, 45.5, 88.75] },
              b: { type: 'pool', pool: [12.25, 15.5, 23.75, 31.25, 40.5, 18.75, 27.25, 35.5] },
            },
            answerExpression: 'round(a - b, 2)', baseDifficulty: 0.35, tags: ['decimal-sub'],
          },
          // Money word problem — clean cents
          {
            id: 'ra-dec-word', type: 'numeric',
            questionTemplate: 'You have ${{a}}. You buy items for ${{b}} and ${{c}}. How much is left?',
            variables: {
              a: { type: 'pool', pool: [50, 75, 100] },
              b: { type: 'pool', pool: [12.50, 15.75, 18.25, 22.50, 27.75, 31.25] },
              c: { type: 'pool', pool: [8.25, 10.50, 13.75, 15.25, 19.50, 21.75] },
            },
            answerExpression: 'round(a - b - c, 2)', baseDifficulty: 0.45, tags: ['word-problem'],
          },
          {
            id: 'ra-frac-div-whole', type: 'numeric',
            questionTemplate: 'What is {{a}}/{{b}} ÷ {{c}}? (Simplify)',
            variables: { a: { type: 'range', min: 1, max: 8 }, b: { type: 'pool', pool: [2,3,4,5,6,8] }, c: { type: 'range', min: 2, max: 6 } },
            answerExpression: 'simplifyFraction(a, b * c)', baseDifficulty: 0.4, tags: ['frac-div'],
          },
          {
            id: 'ra-frac-div-frac', type: 'numeric',
            questionTemplate: 'What is {{a}}/{{b}} ÷ {{c}}/{{d}}? (Simplify)',
            variables: { a: { type: 'range', min: 1, max: 9 }, b: { type: 'pool', pool: [2,3,4,5,6,7,8] }, c: { type: 'range', min: 1, max: 9 }, d: { type: 'pool', pool: [2,3,4,5,6,7,8] } },
            answerExpression: 'simplifyFraction(a * d, b * c)', baseDifficulty: 0.5, tags: ['frac-div'],
          },
          // Decimal × decimal — only clean products
          {
            id: 'ra-dec-mult', type: 'numeric',
            questionTemplate: 'What is {{a}} × {{b}}?',
            variables: {
              a: { type: 'pool', pool: [1.5, 2.5, 3.5, 4.5, 0.5, 1.2, 2.4, 3.6, 0.25, 0.75] },
              b: { type: 'pool', pool: [2, 4, 6, 8, 10, 12, 3, 5, 20] },
            },
            answerExpression: 'a * b', baseDifficulty: 0.45, tags: ['decimal-mult'],
          },
          // Division — only clean quotients
          {
            id: 'ra-whole-div', type: 'numeric',
            questionTemplate: 'What is {{a}} ÷ {{b}}?',
            variables: {
              a: { type: 'pool', pool: [144,120,108,96,84,72,60,48,36,168,180,210,240,252,270,288,300,360] },
              b: { type: 'pool', pool: [3,4,5,6,7,8,9,10,12,15] },
            },
            answerExpression: 'a / b', baseDifficulty: 0.4, tags: ['division'],
          },
          {
            id: 'ra-dec-div', type: 'numeric',
            questionTemplate: 'What is {{a}} ÷ {{b}}?',
            variables: {
              a: { type: 'pool', pool: [10, 15, 20, 25, 30, 40, 50, 60, 75, 100] },
              b: { type: 'pool', pool: [0.5, 2.5, 0.25, 0.2, 0.4, 0.5, 1.25, 2, 4, 5] },
            },
            answerExpression: 'a / b', baseDifficulty: 0.55, tags: ['decimal-div'],
          },
        ],
      },

      // ── Unit 3: Rates and Percentages ──
      {
        id: 'rates-pct-6',
        name: 'Rates & Percentages',
        description: 'Unit rates, percents, and percent word problems',
        icon: '%',
        questionTemplates: [
          // Speed — clean mph
          {
            id: 'rate-unit', type: 'numeric',
            questionTemplate: 'A car travels {{d}} miles in {{t}} hours. What is its speed in miles per hour?',
            variables: {
              d: { type: 'pool', pool: [120,150,180,200,210,240,250,270,280,300,320,350,360,400,420,450,480,500,540,560,600] },
              t: { type: 'pool', pool: [2,3,4,5,6,7,8,10] },
            },
            answerExpression: 'd / t', baseDifficulty: 0.3, tags: ['unit-rate'],
          },
          // Price per oz — clean cents
          {
            id: 'rate-price', type: 'numeric',
            questionTemplate: '{{a}} oz of juice costs ${{p}}. What is the price per ounce?',
            variables: {
              a: { type: 'pool', pool: [8,10,12,16,20,24,32] },
              p: { type: 'pool', pool: [2.00, 2.40, 3.00, 3.20, 4.00, 4.80, 6.00, 6.40, 8.00, 9.60, 12.00] },
            },
            answerExpression: 'round(p / a, 2)', baseDifficulty: 0.4, tags: ['unit-rate'],
          },
          {
            id: 'pct-of-num', type: 'numeric',
            questionTemplate: 'What is {{p}}% of {{n}}?',
            variables: {
              p: { type: 'pool', pool: [5,10,15,20,25,30,40,50,60,75,80,90,100,150,200] },
              n: { type: 'pool', pool: [20,40,50,60,80,100,120,150,200,250,300,400,500,800,1000] },
            },
            answerExpression: '(p / 100) * n', baseDifficulty: 0.35, tags: ['percent-of'],
          },
          {
            id: 'pct-find-pct', type: 'numeric',
            questionTemplate: '{{part}} is what percent of {{whole}}?',
            variables: {
              part: { type: 'pool', pool: [5,10,12,15,20,24,25,30,36,40,45,48,50,60,75,80,90,100] },
              whole: { type: 'pool', pool: [20,25,40,50,60,80,100,120,150,200,250,300,400,500] },
            },
            answerExpression: '(part / whole) * 100', baseDifficulty: 0.45, tags: ['find-percent'],
          },
          // Discount — always clean dollar amount
          {
            id: 'pct-discount', type: 'numeric',
            questionTemplate: 'A jacket costs ${{price}}. It is {{p}}% off. What is the sale price?',
            variables: {
              price: { type: 'pool', pool: [20,30,40,50,60,80,100,120,150,200] },
              p: { type: 'pool', pool: [10,20,25,30,40,50] },
            },
            answerExpression: 'price - (price * p / 100)', baseDifficulty: 0.5, tags: ['discount'],
          },
          // Tax — amounts chosen so tax comes out to clean cents
          {
            id: 'pct-tax', type: 'numeric',
            questionTemplate: 'An item costs ${{price}}. With {{t}}% tax, what is the total?',
            variables: {
              price: { type: 'pool', pool: [10,20,25,40,50,80,100,200] },
              t: { type: 'pool', pool: [5,8,10] },
            },
            answerExpression: 'price + (price * t / 100)', baseDifficulty: 0.5, tags: ['tax'],
          },
          // Percent increase — clean percentages
          {
            id: 'pct-increase', type: 'numeric',
            questionTemplate: 'A value increased from {{a}} to {{b}}. What is the percent increase?',
            variables: {
              a: { type: 'pool', pool: [20,25,40,50,60,80,100,120,150,200] },
              b: { type: 'pool', pool: [25,30,50,60,75,100,125,150,180,250] },
            },
            answerExpression: '((b - a) / a) * 100', baseDifficulty: 0.6, tags: ['percent-change'],
          },
          // Tip — clean totals
          {
            id: 'pct-tip', type: 'numeric',
            questionTemplate: 'Your restaurant bill is ${{bill}}. You leave a {{p}}% tip. What is the total you pay?',
            variables: {
              bill: { type: 'pool', pool: [20,30,40,50,60,80,100] },
              p: { type: 'pool', pool: [10,15,20,25] },
            },
            answerExpression: 'bill + (bill * p / 100)', baseDifficulty: 0.5, tags: ['tip'],
          },
        ],
      },

      // ── Unit 4: Exponents and Order of Operations ──
      {
        id: 'exponents-6',
        name: 'Exponents & Order of Operations',
        description: 'Powers, PEMDAS, and complex expressions',
        icon: '⚡',
        questionTemplates: [
          {
            id: 'exp-sq', type: 'numeric',
            questionTemplate: 'What is {{a}}²?',
            variables: { a: { type: 'range', min: 2, max: 15 } },
            answerExpression: 'a * a', baseDifficulty: 0.2, tags: ['exponents'],
          },
          {
            id: 'exp-cube', type: 'numeric',
            questionTemplate: 'What is {{a}}³?',
            variables: { a: { type: 'range', min: 2, max: 8 } },
            answerExpression: 'a * a * a', baseDifficulty: 0.35, tags: ['exponents'],
          },
          {
            id: 'exp-frac', type: 'numeric',
            questionTemplate: 'What is ({{a}}/{{b}})²? (Simplify)',
            variables: { a: { type: 'range', min: 1, max: 7 }, b: { type: 'pool', pool: [2,3,4,5,6,8] } },
            answerExpression: 'simplifyFraction(a * a, b * b)', baseDifficulty: 0.45, tags: ['exponent-frac'],
          },
          {
            id: 'pemdas-6a', type: 'numeric',
            questionTemplate: 'Solve: {{a}} + {{b}} × {{c}} − {{d}}',
            variables: { a: { type: 'range', min: 5, max: 25 }, b: { type: 'range', min: 2, max: 9 }, c: { type: 'range', min: 2, max: 9 }, d: { type: 'range', min: 1, max: 15 } },
            answerExpression: 'a + b * c - d', baseDifficulty: 0.4, tags: ['pemdas'],
          },
          {
            id: 'pemdas-6b', type: 'numeric',
            questionTemplate: 'Solve: {{a}}² − {{b}} × ({{c}} + {{d}})',
            variables: { a: { type: 'range', min: 4, max: 10 }, b: { type: 'range', min: 2, max: 5 }, c: { type: 'range', min: 1, max: 6 }, d: { type: 'range', min: 1, max: 6 } },
            answerExpression: 'a * a - b * (c + d)', baseDifficulty: 0.55, tags: ['pemdas', 'exponents'],
          },
          {
            id: 'pemdas-6c', type: 'numeric',
            questionTemplate: 'Solve: {{a}} × {{b}}² + {{c}}',
            variables: { a: { type: 'range', min: 2, max: 6 }, b: { type: 'range', min: 2, max: 7 }, c: { type: 'range', min: 1, max: 20 } },
            answerExpression: 'a * b * b + c', baseDifficulty: 0.5, tags: ['pemdas'],
          },
          {
            id: 'pemdas-6d', type: 'numeric',
            questionTemplate: 'Solve: ({{a}} + {{b}})² − {{c}}',
            variables: { a: { type: 'range', min: 2, max: 8 }, b: { type: 'range', min: 1, max: 7 }, c: { type: 'range', min: 1, max: 30 } },
            answerExpression: '(a + b) * (a + b) - c', baseDifficulty: 0.55, tags: ['pemdas', 'exponents'],
          },
        ],
      },

      // ── Unit 5: Negative Numbers ──
      {
        id: 'negatives-6',
        name: 'Negative Numbers',
        description: 'Operations with negatives and absolute value',
        icon: '➖',
        questionTemplates: [
          {
            id: 'neg-add', type: 'numeric',
            questionTemplate: 'What is {{a}} + ({{b}})?',
            variables: { a: { type: 'range', min: -50, max: 50 }, b: { type: 'range', min: -50, max: 50 } },
            answerExpression: 'a + b', baseDifficulty: 0.3, tags: ['addition'],
          },
          {
            id: 'neg-sub', type: 'numeric',
            questionTemplate: 'What is {{a}} − ({{b}})?',
            variables: { a: { type: 'range', min: -40, max: 40 }, b: { type: 'range', min: -40, max: 40 } },
            answerExpression: 'a - b', baseDifficulty: 0.4, tags: ['subtraction'],
          },
          {
            id: 'neg-mult', type: 'numeric',
            questionTemplate: 'What is {{a}} × {{b}}?',
            variables: { a: { type: 'range', min: -12, max: 12 }, b: { type: 'range', min: -12, max: 12 } },
            answerExpression: 'a * b', baseDifficulty: 0.4, tags: ['multiplication'],
          },
          {
            id: 'neg-abs', type: 'numeric',
            questionTemplate: 'What is |{{a}}| + |{{b}}|?',
            variables: { a: { type: 'range', min: -30, max: 30 }, b: { type: 'range', min: -30, max: 30 } },
            answerExpression: 'Math.abs(a) + Math.abs(b)', baseDifficulty: 0.35, tags: ['absolute-value'],
          },
          {
            id: 'neg-abs-diff', type: 'numeric',
            questionTemplate: 'What is |{{a}} − {{b}}|?',
            variables: { a: { type: 'range', min: -20, max: 20 }, b: { type: 'range', min: -20, max: 20 } },
            answerExpression: 'Math.abs(a - b)', baseDifficulty: 0.45, tags: ['absolute-value'],
          },
          {
            id: 'neg-expression', type: 'numeric',
            questionTemplate: 'Evaluate: {{a}} × {{b}} + {{c}}',
            variables: { a: { type: 'range', min: -8, max: 8 }, b: { type: 'range', min: -8, max: 8 }, c: { type: 'range', min: -20, max: 20 } },
            answerExpression: 'a * b + c', baseDifficulty: 0.5, tags: ['expression'],
          },
          {
            id: 'neg-temp', type: 'numeric',
            questionTemplate: 'The temperature is {{a}}°F. It drops {{b}} degrees. What is the new temperature?',
            variables: { a: { type: 'range', min: -10, max: 30 }, b: { type: 'range', min: 5, max: 40 } },
            answerExpression: 'a - b', baseDifficulty: 0.35, tags: ['word-problem'],
          },
        ],
      },

      // ── Unit 6: Variables & Expressions ──
      {
        id: 'variables-6',
        name: 'Variables & Expressions',
        description: 'Evaluating, LCM, GCF, distributive property',
        icon: '🔤',
        questionTemplates: [
          {
            id: 'var-eval', type: 'numeric',
            questionTemplate: 'If x = {{x}}, what is {{a}}x + {{b}}?',
            variables: { x: { type: 'range', min: -8, max: 12 }, a: { type: 'range', min: 2, max: 9 }, b: { type: 'range', min: -15, max: 15 } },
            answerExpression: 'a * x + b', baseDifficulty: 0.35, tags: ['evaluate'],
          },
          {
            id: 'var-eval-2', type: 'numeric',
            questionTemplate: 'If a = {{a}} and b = {{b}}, what is {{c}}a − {{d}}b?',
            variables: { a: { type: 'range', min: -6, max: 10 }, b: { type: 'range', min: -6, max: 10 }, c: { type: 'range', min: 2, max: 7 }, d: { type: 'range', min: 2, max: 7 } },
            answerExpression: 'c * a - d * b', baseDifficulty: 0.45, tags: ['evaluate'],
          },
          {
            id: 'var-eval-sq', type: 'numeric',
            questionTemplate: 'If n = {{n}}, what is {{a}}n² + {{b}}?',
            variables: { n: { type: 'range', min: -5, max: 8 }, a: { type: 'range', min: 1, max: 5 }, b: { type: 'range', min: -10, max: 10 } },
            answerExpression: 'a * n * n + b', baseDifficulty: 0.55, tags: ['exponents'],
          },
          {
            id: 'var-lcm', type: 'numeric',
            questionTemplate: 'What is the LCM of {{a}} and {{b}}?',
            variables: { a: { type: 'pool', pool: [2,3,4,5,6,7,8,9,10,12,14,15,16,18,20,24] }, b: { type: 'pool', pool: [2,3,4,5,6,7,8,9,10,12,14,15,16,18,20,24] } },
            answerExpression: '(a * b) / gcd(a, b)', baseDifficulty: 0.4, tags: ['lcm'],
          },
          {
            id: 'var-gcf', type: 'numeric',
            questionTemplate: 'What is the GCF of {{a}} and {{b}}?',
            variables: { a: { type: 'pool', pool: [12,16,18,20,24,28,30,32,36,40,42,48,54,56,60,72] }, b: { type: 'pool', pool: [8,12,15,16,18,20,24,28,30,36,40,42,48,54,56,60] } },
            answerExpression: 'gcd(a, b)', baseDifficulty: 0.4, tags: ['gcf'],
          },
          {
            id: 'var-distrib', type: 'numeric',
            questionTemplate: 'Expand: {{a}}({{b}}x + {{c}}). What is the coefficient of x?',
            variables: { a: { type: 'range', min: 2, max: 8 }, b: { type: 'range', min: 1, max: 6 }, c: { type: 'range', min: -8, max: 8 } },
            answerExpression: 'a * b', baseDifficulty: 0.45, tags: ['distributive'],
          },
          {
            id: 'var-distrib-const', type: 'numeric',
            questionTemplate: 'Expand: {{a}}({{b}}x + {{c}}). What is the constant term?',
            variables: { a: { type: 'range', min: 2, max: 8 }, b: { type: 'range', min: 1, max: 6 }, c: { type: 'range', min: -8, max: 8 } },
            answerExpression: 'a * c', baseDifficulty: 0.45, tags: ['distributive'],
          },
        ],
      },

      // ── Unit 7: Equations & Inequalities ──
      {
        id: 'equations-6',
        name: 'Equations & Inequalities',
        description: 'One-step and two-step equations',
        icon: '🟰',
        questionTemplates: [
          {
            id: 'eq-add', type: 'numeric',
            questionTemplate: 'Solve for x: x + {{a}} = {{b}}',
            variables: { a: { type: 'range', min: -20, max: 30 }, b: { type: 'range', min: -15, max: 50 } },
            answerExpression: 'b - a', baseDifficulty: 0.25, tags: ['one-step'],
          },
          {
            id: 'eq-sub', type: 'numeric',
            questionTemplate: 'Solve for x: x − {{a}} = {{b}}',
            variables: { a: { type: 'range', min: -15, max: 25 }, b: { type: 'range', min: -20, max: 30 } },
            answerExpression: 'b + a', baseDifficulty: 0.25, tags: ['one-step'],
          },
          // Multiplication — b always divisible by a
          {
            id: 'eq-mult', type: 'numeric',
            questionTemplate: 'Solve for x: {{a}}x = {{b}}',
            variables: {
              a: { type: 'pool', pool: [2,3,4,5,6,7,8,9,10,12] },
              b: { type: 'pool', pool: [-60,-48,-36,-24,-18,-12,-8,-6,6,8,10,12,14,16,18,20,24,27,28,30,32,36,40,42,45,48,54,56,60,72,80,84,90,96] },
            },
            answerExpression: 'b / a', baseDifficulty: 0.3, tags: ['one-step'],
          },
          {
            id: 'eq-div', type: 'numeric',
            questionTemplate: 'Solve for x: x/{{a}} = {{b}}',
            variables: { a: { type: 'range', min: 2, max: 10 }, b: { type: 'range', min: -8, max: 12 } },
            answerExpression: 'a * b', baseDifficulty: 0.3, tags: ['one-step'],
          },
          // Two-step — (c - b) always divisible by a
          {
            id: 'eq-two-step', type: 'numeric',
            questionTemplate: 'Solve for x: {{a}}x + {{b}} = {{c}}',
            variables: {
              a: { type: 'pool', pool: [2,3,4,5,6,7,8] },
              b: { type: 'range', min: -12, max: 12 },
              c: { type: 'pool', pool: [-20,-16,-10,-8,-4,-2,0,2,4,6,8,10,12,14,16,18,20,22,24,26,28,30,34,38,40,44,46,50] },
            },
            answerExpression: '(c - b) / a', baseDifficulty: 0.5, tags: ['two-step'],
          },
          {
            id: 'eq-two-step-div', type: 'numeric',
            questionTemplate: 'Solve for x: x/{{a}} − {{b}} = {{c}}',
            variables: { a: { type: 'range', min: 2, max: 8 }, b: { type: 'range', min: 1, max: 10 }, c: { type: 'range', min: -5, max: 12 } },
            answerExpression: '(c + b) * a', baseDifficulty: 0.5, tags: ['two-step'],
          },
          // Word problem — always clean
          {
            id: 'eq-word', type: 'numeric',
            questionTemplate: 'A number multiplied by {{a}}, then increased by {{b}}, equals {{c}}. What is the number?',
            variables: {
              a: { type: 'pool', pool: [2,3,4,5,6] },
              b: { type: 'range', min: 1, max: 12 },
              c: { type: 'pool', pool: [11,13,14,16,17,19,20,22,23,25,26,28,29,31,32,34,35,37,38,40,41,43,44,46,47,50] },
            },
            answerExpression: '(c - b) / a', baseDifficulty: 0.55, tags: ['word-problem'],
          },
        ],
      },

      // ── Unit 8: Plane Figures ──
      {
        id: 'plane-figures-6',
        name: 'Plane Figures',
        description: 'Area of parallelograms, triangles, and composites',
        icon: '📐',
        questionTemplates: [
          {
            id: 'area-para', type: 'numeric',
            questionTemplate: 'A parallelogram has base {{b}} cm and height {{h}} cm. What is its area in cm²?',
            variables: { b: { type: 'range', min: 3, max: 20 }, h: { type: 'range', min: 3, max: 15 } },
            answerExpression: 'b * h', baseDifficulty: 0.3, tags: ['parallelogram'],
          },
          // Triangle — only even products so area is whole number
          {
            id: 'area-tri', type: 'numeric',
            questionTemplate: 'A triangle has base {{b}} cm and height {{h}} cm. What is its area in cm²?',
            variables: { b: { type: 'pool', pool: [4,6,8,10,12,14,16,18,20] }, h: { type: 'range', min: 3, max: 15 } },
            answerExpression: '(b * h) / 2', baseDifficulty: 0.3, tags: ['triangle'],
          },
          // Trapezoid — (a+b) always even so area is whole
          {
            id: 'area-trap', type: 'numeric',
            questionTemplate: 'A trapezoid has parallel sides {{a}} cm and {{b}} cm, and height {{h}} cm. What is its area?',
            variables: {
              a: { type: 'pool', pool: [3,4,5,6,7,8,10,12] },
              b: { type: 'pool', pool: [5,6,7,8,9,10,12,14] },
              h: { type: 'pool', pool: [2,4,6,8,10] },
            },
            answerExpression: '((a + b) * h) / 2', baseDifficulty: 0.45, tags: ['trapezoid'],
          },
          {
            id: 'area-composite', type: 'numeric',
            questionTemplate: 'An L-shape is made of two rectangles: {{a}}×{{b}} and {{c}}×{{d}}. What is the total area?',
            variables: { a: { type: 'range', min: 3, max: 10 }, b: { type: 'range', min: 3, max: 10 }, c: { type: 'range', min: 3, max: 10 }, d: { type: 'range', min: 3, max: 10 } },
            answerExpression: 'a * b + c * d', baseDifficulty: 0.4, tags: ['composite'],
          },
          // Find height — area always divisible cleanly
          {
            id: 'area-find-h', type: 'numeric',
            questionTemplate: 'A triangle has area {{area}} cm² and base {{b}} cm. What is its height?',
            variables: {
              b: { type: 'pool', pool: [4,5,6,8,10,12] },
              area: { type: 'pool', pool: [12,15,20,24,30,36,40,48,60] },
            },
            answerExpression: '(2 * area) / b', baseDifficulty: 0.5, tags: ['find-dimension'],
          },
        ],
      },

      // ── Unit 9: Coordinate Plane ──
      {
        id: 'coord-plane-6',
        name: 'Coordinate Plane',
        description: 'Distance and polygons on the coordinate plane',
        icon: '📊',
        questionTemplates: [
          {
            id: 'coord-dist-h', type: 'numeric',
            questionTemplate: 'What is the distance between ({{x1}}, {{y}}) and ({{x2}}, {{y}})?',
            variables: { x1: { type: 'range', min: -10, max: 10 }, x2: { type: 'range', min: -10, max: 10 }, y: { type: 'range', min: -8, max: 8 } },
            answerExpression: 'Math.abs(x2 - x1)', baseDifficulty: 0.3, tags: ['distance'],
          },
          {
            id: 'coord-dist-v', type: 'numeric',
            questionTemplate: 'What is the distance between ({{x}}, {{y1}}) and ({{x}}, {{y2}})?',
            variables: { x: { type: 'range', min: -8, max: 8 }, y1: { type: 'range', min: -10, max: 10 }, y2: { type: 'range', min: -10, max: 10 } },
            answerExpression: 'Math.abs(y2 - y1)', baseDifficulty: 0.3, tags: ['distance'],
          },
          {
            id: 'coord-perim', type: 'numeric',
            questionTemplate: 'A rectangle has opposite corners at ({{x1}}, {{y1}}) and ({{x2}}, {{y2}}). What is its perimeter?',
            variables: { x1: { type: 'range', min: -8, max: 0 }, y1: { type: 'range', min: -6, max: 0 }, x2: { type: 'range', min: 1, max: 8 }, y2: { type: 'range', min: 1, max: 6 } },
            answerExpression: '2 * (Math.abs(x2 - x1) + Math.abs(y2 - y1))', baseDifficulty: 0.45, tags: ['perimeter'],
          },
          {
            id: 'coord-area-rect', type: 'numeric',
            questionTemplate: 'A rectangle has opposite corners at ({{x1}}, {{y1}}) and ({{x2}}, {{y2}}). What is its area?',
            variables: { x1: { type: 'range', min: -8, max: 0 }, y1: { type: 'range', min: -6, max: 0 }, x2: { type: 'range', min: 1, max: 8 }, y2: { type: 'range', min: 1, max: 6 } },
            answerExpression: 'Math.abs(x2 - x1) * Math.abs(y2 - y1)', baseDifficulty: 0.5, tags: ['area'],
          },
        ],
      },

      // ── Unit 10: 3D Figures ──
      {
        id: '3d-figures-6',
        name: '3D Figures',
        description: 'Volume and surface area',
        icon: '📦',
        questionTemplates: [
          {
            id: '3d-vol-rect', type: 'numeric',
            questionTemplate: 'A rectangular prism is {{l}} × {{w}} × {{h}}. What is its volume?',
            variables: { l: { type: 'range', min: 2, max: 12 }, w: { type: 'range', min: 2, max: 10 }, h: { type: 'range', min: 2, max: 8 } },
            answerExpression: 'l * w * h', baseDifficulty: 0.3, tags: ['volume'],
          },
          {
            id: '3d-vol-frac', type: 'numeric',
            questionTemplate: 'A cube has side length {{a}}/{{b}}. What is its volume? (Simplify)',
            variables: { a: { type: 'range', min: 1, max: 5 }, b: { type: 'pool', pool: [2,3,4] } },
            answerExpression: 'simplifyFraction(a * a * a, b * b * b)', baseDifficulty: 0.55, tags: ['volume', 'fractions'],
          },
          {
            id: '3d-sa-rect', type: 'numeric',
            questionTemplate: 'A box is {{l}} × {{w}} × {{h}}. What is its surface area?',
            variables: { l: { type: 'range', min: 2, max: 10 }, w: { type: 'range', min: 2, max: 8 }, h: { type: 'range', min: 2, max: 8 } },
            answerExpression: '2 * (l * w + w * h + l * h)', baseDifficulty: 0.45, tags: ['surface-area'],
          },
          {
            id: '3d-sa-cube', type: 'numeric',
            questionTemplate: 'A cube has side length {{s}}. What is its surface area?',
            variables: { s: { type: 'range', min: 2, max: 12 } },
            answerExpression: '6 * s * s', baseDifficulty: 0.3, tags: ['cube'],
          },
          // Volume find dim — v always divisible by l*w
          {
            id: '3d-find-h', type: 'numeric',
            questionTemplate: 'A box has volume {{v}}, length {{l}}, and width {{w}}. What is its height?',
            variables: {
              l: { type: 'pool', pool: [2,3,4,5,6] },
              w: { type: 'pool', pool: [2,3,4,5,6] },
              v: { type: 'pool', pool: [24,36,48,60,72,80,96,120,144,150,160,180,240,360] },
            },
            answerExpression: 'v / (l * w)', baseDifficulty: 0.5, tags: ['find-dimension'],
          },
        ],
      },

      // ── Unit 11: Data & Statistics ──
      {
        id: 'statistics-6',
        name: 'Data & Statistics',
        description: 'Mean, median, range, and MAD',
        icon: '📈',
        questionTemplates: [
          // Mean — 5 numbers that always average cleanly
          {
            id: 'stat-mean', type: 'numeric',
            questionTemplate: 'Find the mean of: {{a}}, {{b}}, {{c}}, {{d}}, {{e}}',
            variables: {
              a: { type: 'pool', pool: [10,15,20,25,30,35,40,45,50,55,60,65,70,75,80,85,90] },
              b: { type: 'pool', pool: [10,15,20,25,30,35,40,45,50,55,60,65,70,75,80,85,90] },
              c: { type: 'pool', pool: [10,15,20,25,30,35,40,45,50,55,60,65,70,75,80,85,90] },
              d: { type: 'pool', pool: [10,15,20,25,30,35,40,45,50,55,60,65,70,75,80,85,90] },
              e: { type: 'pool', pool: [10,15,20,25,30,35,40,45,50,55,60,65,70,75,80,85,90] },
            },
            answerExpression: '(a + b + c + d + e) / 5', baseDifficulty: 0.35, tags: ['mean'],
          },
          // Find missing value for target mean — always whole
          {
            id: 'stat-mean-find', type: 'numeric',
            questionTemplate: 'The mean of {{a}}, {{b}}, {{c}}, and x is {{m}}. What is x?',
            variables: {
              a: { type: 'range', min: 5, max: 25 },
              b: { type: 'range', min: 5, max: 25 },
              c: { type: 'range', min: 5, max: 25 },
              m: { type: 'range', min: 10, max: 25 },
            },
            answerExpression: '4 * m - a - b - c', baseDifficulty: 0.55, tags: ['mean'],
          },
          {
            id: 'stat-range', type: 'numeric',
            questionTemplate: 'Find the range of: {{a}}, {{b}}, {{c}}, {{d}}, {{e}}, {{f}}',
            variables: {
              a: { type: 'range', min: 1, max: 50 }, b: { type: 'range', min: 1, max: 50 },
              c: { type: 'range', min: 1, max: 50 }, d: { type: 'range', min: 1, max: 50 },
              e: { type: 'range', min: 1, max: 50 }, f: { type: 'range', min: 1, max: 50 },
            },
            answerExpression: 'Math.max(a,b,c,d,e,f) - Math.min(a,b,c,d,e,f)', baseDifficulty: 0.3, tags: ['range'],
          },
        ],
      },
    ],
  },

  // Placeholders
  { id: 'english-6', subject: 'english', grade: 6, name: 'English', icon: '📖', color: '#e8890c', topics: [] },
  { id: 'science-6', subject: 'science', grade: 6, name: 'Science', icon: '🔬', color: '#1b7e4f', topics: [] },
]

export function getCoursesForGrade(grade: number): Course[] {
  return courses.filter((c) => c.grade === grade && c.topics.length > 0)
}

export function getAvailableGrades(): { grade: number; active: boolean }[] {
  return Array.from({ length: 12 }, (_, i) => ({
    grade: i + 1,
    active: i + 1 === 5 || i + 1 === 6,
  }))
}

export function getCourse(courseId: string): Course | undefined {
  return courses.find((c) => c.id === courseId)
}

export function getTopic(courseId: string, topicId: string) {
  const course = getCourse(courseId)
  return course?.topics.find((t) => t.id === topicId)
}
