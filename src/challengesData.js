// src/data/challengesData.js

const CHALLENGE_VIDEOS = {
  // Introduction to JS (8 تحديات)
  "intro-1": "/vidoe/الطباعة_في_جافاسكريبت.mp4",
  "intro-2": "/vidoe/متغيرات_البرمجة_وجافا_سكريبت.mp4",
  "intro-3": "/vidoe/أساسيات_JS__أنواع_البيانات.mp4",
  "intro-4": "/video/intro/operators.mp4",
  "intro-5": "/video/intro/strings.mp4",
  "intro-6": "/video/intro/arrays.mp4",
  "intro-7": "/video/intro/loops.mp4",
  "intro-8": "/video/intro/conditions.mp4",

  // Control Flow (8 تحديات)
  "control-1": "/video/control/if_else.mp4",
  "control-2": "/video/control/switch.mp4",
  "control-3": "/video/control/while_loop.mp4",
  "control-4": "/video/control/for_loop.mp4",
  "control-5": "/video/control/break_continue.mp4",
  "control-6": "/video/control/nested_loops.mp4",
  "control-7": "/video/control/ternary_operator.mp4",
  "control-8": "/video/control/logical_operators.mp4",

  // Data Structures (8 تحديات)
  "data-1": "/video/data/objects.mp4",
  "data-2": "/video/data/maps.mp4",
  "data-3": "/video/data/sets.mp4",
  "data-4": "/video/data/array_methods.mp4",
  "data-5": "/video/data/destructuring.mp4",
  "data-6": "/video/data/spread_rest.mp4",
  "data-7": "/video/data/json.mp4",
  "data-8": "/video/data/iterators.mp4",

  // Functions & Scope (8 تحديات)
  "functions-1": "/video/functions/function_basics.mp4",
  "functions-2": "/video/functions/arrow_functions.mp4",
  "functions-3": "/video/functions/closures.mp4",
  "functions-4": "/video/functions/callbacks.mp4",
  "functions-5": "/video/functions/promises.mp4",
  "functions-6": "/video/functions/async_await.mp4",
  "functions-7": "/video/functions/function_scope.mp4",
  "functions-8": "/video/functions/higher_order_functions.mp4",
};

const challengesData = {
  "introduction-to-js": [
    {
      id: "intro-1",
      title: {
        en: "INTRODUCTION TO JS — Hello World",
        ar: "مقدمة في جافاسكريبت — مرحباً بالعالم",
      },
      difficulty: "Easy",
      short: {
        en: "Print simple text to console.",
        ar: "اطبع نصًا بسيطًا في الكونسول.",
      },
      description: {
        en:
          "Write a function that prints exactly the string `Hello World` to the console.\nThis mission checks that you can use console.log and call a function.",
        ar:
          "اكتب دالة تطبع النص `Hello World` بالضبط في الكونسول.\nتتحقق هذه المهمة من قدرتك على استخدام console.log واستدعاء دالة.",
      },
      starter: `function main(){
  // Your code here
}
main();`,
      expected: "Hello World",
      objectives: {
        en: ["Use console.log", "Define and call a function", "Match exact output"],
        ar: ["استخدام console.log", "تعريف واستدعاء دالة", "مطابقة الناتج بدقة"],
      },
      video: CHALLENGE_VIDEOS["intro-1"],
      solution: `function main(){
  console.log("Hello World");
}
main();`,
    },
    {
      id: "intro-2",
      title: { en: "INTRODUCTION TO JS — Variables", ar: "مقدمة في جافاسكريبت — المتغيرات" },
      difficulty: "Easy",
      short: { en: "Declare a variable and print it.", ar: "أعلن متغيرًا واطبعه." },
      description: {
        en: "Declare a variable `name` with value `Developer` and print it to the console.",
        ar: "أعلن متغيرًا باسم `name` بقيمة `Developer` واطبعه في الكونسول.",
      },
      starter: `function main(){
  // Your code here
}
main();`,
      expected: "Developer",
      objectives: { en: ["Declare variables", "Print variable value"], ar: ["إعلان المتغيرات", "طباعة قيمة المتغير"] },
      video: CHALLENGE_VIDEOS["intro-2"],
      solution: `function main(){
  const name = "Developer";
  console.log(name);
}
main();`,
    },
    {
      id: "intro-3",
      title: { en: "INTRODUCTION TO JS — Data Types", ar: "مقدمة في جافاسكريبت — أنواع البيانات" },
      difficulty: "Medium",
      short: { en: "Print different data types.", ar: "اطبع أنواع بيانات مختلفة." },
      description: {
        en: "Print the number 42, the string 'JS', and boolean true each on a new line.",
        ar: "اطبع الرقم 42، السلسلة 'JS'، والقيمة المنطقية true كلٌ في سطرٍ جديد.",
      },
      starter: `function main(){
  // Your code here
}
main();`,
      expected: "42\nJS\ntrue",
      objectives: { en: ["Print numbers", "Print strings", "Print booleans"], ar: ["طباعة أرقام", "طباعة سلاسل نصية", "طباعة قيم منطقية"] },
      video: CHALLENGE_VIDEOS["intro-3"],
      solution: `function main(){
  console.log(42);
  console.log("JS");
  console.log(true);
}
main();`,
    },
    {
      id: "intro-4",
      title: { en: "INTRODUCTION TO JS — Operators", ar: "مقدمة في جافاسكريبت — العمليات" },
      difficulty: "Medium",
      short: { en: "Use arithmetic operators.", ar: "استخدم العمليات الحسابية." },
      description: { en: "Calculate and print the result of (5 + 3) * 2.", ar: "احسب واطبع نتيجة (5 + 3) * 2." },
      starter: `function main(){
  // Your code here
}
main();`,
      expected: "16",
      objectives: { en: ["Use arithmetic operators", "Print result"], ar: ["استخدام العمليات الحسابية", "طباعة النتيجة"] },
      video: CHALLENGE_VIDEOS["intro-4"],
      solution: `function main(){
  console.log((5 + 3) * 2);
}
main();`,
    },
    {
      id: "intro-5",
      title: { en: "INTRODUCTION TO JS — Strings", ar: "مقدمة في جافاسكريبت — السلاسل النصية" },
      difficulty: "Medium",
      short: { en: "Concatenate and print strings.", ar: "اجمع سلاسل نصية واطبعها." },
      description: { en: "Concatenate 'Hello' and 'World' with a space and print the result.", ar: "اجمع 'Hello' و 'World' بمسافة واحدة واطبع النتيجة." },
      starter: `function main(){
  // Your code here
}
main();`,
      expected: "Hello World",
      objectives: { en: ["String concatenation", "Print result"], ar: ["جمع السلاسل النصية", "طباعة النتيجة"] },
      video: CHALLENGE_VIDEOS["intro-5"],
      solution: `function main(){
  console.log("Hello" + " " + "World");
}
main();`,
    },
    {
      id: "intro-6",
      title: { en: "INTRODUCTION TO JS — Arrays", ar: "مقدمة في جافاسكريبت — المصفوفات" },
      difficulty: "Medium",
      short: { en: "Create and print an array.", ar: "أنشئ مصفوفة واطبعها." },
      description: { en: "Create an array with numbers 1 to 3 and print it.", ar: "أنشئ مصفوفة تحتوي الأرقام 1 إلى 3 واطبعها." },
      starter: `function main(){
  // Your code here
}
main();`,
      expected: "1,2,3",
      objectives: { en: ["Create arrays", "Print arrays"], ar: ["إنشاء مصفوفات", "طباعة المصفوفات"] },
      video: CHALLENGE_VIDEOS["intro-6"],
      solution: `function main(){
  const arr = [1, 2, 3];
  console.log(arr);
}
main();`,
    },
    {
      id: "intro-7",
      title: { en: "INTRODUCTION TO JS — Loops", ar: "مقدمة في جافاسكريبت — الحلقات" },
      difficulty: "Hard",
      short: { en: "Print numbers 1 to 5 using a loop.", ar: "اطبع الأرقام من 1 إلى 5 باستخدام حلقة." },
      description: { en: "Use a for loop to print numbers from 1 to 5, each on a new line.", ar: "استخدم حلقة for لطباعة الأرقام من 1 إلى 5 كلٌ في سطرٍ جديد." },
      starter: `function main(){
  // Your code here
}
main();`,
      expected: "1\n2\n3\n4\n5",
      objectives: { en: ["Use for loops", "Print numbers"], ar: ["استخدام حلقات for", "طباعة الأرقام"] },
      video: CHALLENGE_VIDEOS["intro-7"],
      solution: `function main(){
  for(let i=1; i<=5; i++){
    console.log(i);
  }
}
main();`,
    },
    {
      id: "intro-8",
      title: { en: "INTRODUCTION TO JS — Conditions", ar: "مقدمة في جافاسكريبت — الشروط" },
      difficulty: "Hard",
      short: { en: "Check if a number is positive.", ar: "تحقق مما إذا كان العدد موجبًا." },
      description: { en: "Print 'Positive' if number is greater than 0, else print 'Non-positive'.", ar: "اطبع 'Positive' إذا كان العدد أكبر من 0، وإلا اطبع 'Non-positive'." },
      starter: `function main(){
  const num = 3;
  // Your code here
}
main();`,
      expected: "Positive",
      objectives: { en: ["Use if-else", "Print correct message"], ar: ["استخدام if-else", "طباعة الرسالة الصحيحة"] },
      video: CHALLENGE_VIDEOS["intro-8"],
      solution: `function main(){
  const num = 3;
  if(num > 0){
    console.log("Positive");
  } else {
    console.log("Non-positive");
  }
}
main();`,
    },
  ],

  "control-flow": [
    {
      id: "control-1",
      title: { en: "CONTROL FLOW — If-Else Basics", ar: "التحكم في التدفق — أساسيات if-else" },
      difficulty: "Easy",
      short: { en: "Use if-else to check a condition.", ar: "استخدم if-else للتحقق من شرط." },
      description: { en: "Print 'Yes' if variable `x` is true, else print 'No'.", ar: "اطبع 'نعم' إذا كان المتغير `x` صحيحًا، وإلا اطبع 'لا'." },
      starter: `function main(){
  const x = true;
  // Your code here
}
main();`,
      expected: "Yes",
      objectives: { en: ["Use if-else", "Print correct output"], ar: ["استخدام if-else", "طباعة الناتج الصحيح"] },
      video: CHALLENGE_VIDEOS["control-1"],
      solution: `function main(){
  const x = true;
  if(x){
    console.log("Yes");
  } else {
    console.log("No");
  }
}
main();`,
    },
    {
      id: "control-2",
      title: { en: "CONTROL FLOW — Switch Statement", ar: "التحكم في التدفق — جملة switch" },
      difficulty: "Medium",
      short: { en: "Use switch to print day name.", ar: "استخدم switch لطباعة اسم اليوم." },
      description: { en: "Given a number 1-3, print 'One', 'Two', or 'Three' accordingly.", ar: "بناءً على رقم من 1 إلى 3، اطبع 'One' أو 'Two' أو 'Three'." },
      starter: `function main(){
  const num = 2;
  // Your code here
}
main();`,
      expected: "Two",
      objectives: { en: ["Use switch", "Print correct case"], ar: ["استخدام switch", "طباعة الحالة الصحيحة"] },
      video: CHALLENGE_VIDEOS["control-2"],
      solution: `function main(){
  const num = 2;
  switch(num){
    case 1: console.log("One"); break;
    case 2: console.log("Two"); break;
    case 3: console.log("Three"); break;
    default: console.log("Invalid");
  }
}
main();`,
    },
    {
      id: "control-3",
      title: { en: "CONTROL FLOW — While Loop", ar: "التحكم في التدفق — حلقة while" },
      difficulty: "Medium",
      short: { en: "Print numbers 1 to 3 using while loop.", ar: "اطبع الأرقام 1 إلى 3 باستخدام حلقة while." },
      description: { en: "Use a while loop to print numbers 1, 2, 3 each on a new line.", ar: "استخدم حلقة while لطباعة 1، 2، 3 كلٌ في سطرٍ جديد." },
      starter: `function main(){
  // Your code here
}
main();`,
      expected: "1\n2\n3",
      objectives: { en: ["Use while loop", "Print numbers"], ar: ["استخدام حلقة while", "طباعة الأرقام"] },
      video: CHALLENGE_VIDEOS["control-3"],
      solution: `function main(){
  let i = 1;
  while(i <= 3){
    console.log(i);
    i++;
  }
}
main();`,
    },
    {
      id: "control-4",
      title: { en: "CONTROL FLOW — For Loop", ar: "التحكم في التدفق — حلقة for" },
      difficulty: "Medium",
      short: { en: "Sum numbers 1 to 5 using for loop.", ar: "اجمع الأرقام من 1 إلى 5 باستخدام حلقة for." },
      description: { en: "Calculate sum of numbers from 1 to 5 and print the result.", ar: "احسب مجموع الأرقام من 1 إلى 5 واطبع النتيجة." },
      starter: `function main(){
  // Your code here
}
main();`,
      expected: "15",
      objectives: { en: ["Use for loop", "Calculate sum", "Print result"], ar: ["استخدام حلقة for", "حساب المجموع", "طباعة النتيجة"] },
      video: CHALLENGE_VIDEOS["control-4"],
      solution: `function main(){
  let sum = 0;
  for(let i=1; i<=5; i++){
    sum += i;
  }
  console.log(sum);
}
main();`,
    },
    {
      id: "control-5",
      title: { en: "CONTROL FLOW — Break and Continue", ar: "التحكم في التدفق — break و continue" },
      difficulty: "Hard",
      short: { en: "Use break and continue in a loop.", ar: "استخدم break و continue داخل حلقة." },
      description: { en: "Print numbers 1 to 5 but skip 3 and stop after 4.", ar: "اطبع الأرقام 1 إلى 5 لكن تجاهل 3 وتوقف بعد 4." },
      starter: `function main(){
  // Your code here
}
main();`,
      expected: "1\n2\n4",
      objectives: { en: ["Use break", "Use continue", "Control loop flow"], ar: ["استخدام break", "استخدام continue", "التحكم في تدفق الحلقة"] },
      video: CHALLENGE_VIDEOS["control-5"],
      solution: `function main(){
  for(let i=1; i<=5; i++){
    if(i === 3) continue;
    if(i === 5) break;
    console.log(i);
  }
}
main();`,
    },
    {
      id: "control-6",
      title: { en: "CONTROL FLOW — Nested Loops", ar: "التحكم في التدفق — الحلقات المتداخلة" },
      difficulty: "Hard",
      short: { en: "Print a multiplication table 1x1 to 3x3.", ar: "اطبع جدول الضرب من 1x1 إلى 3x3." },
      description: { en: "Use nested loops to print multiplication results from 1 to 3.", ar: "استخدم حلقات متداخلة لطباعة نتائج الضرب من 1 إلى 3." },
      starter: `function main(){
  // Your code here
}
main();`,
      expected: "1\n2\n3\n2\n4\n6\n3\n6\n9",
      objectives: { en: ["Use nested loops", "Print multiplication results"], ar: ["استخدام الحلقات المتداخلة", "طباعة نتائج الضرب"] },
      video: CHALLENGE_VIDEOS["control-6"],
      solution: `function main(){
  for(let i=1; i<=3; i++){
    for(let j=1; j<=3; j++){
      console.log(i*j);
    }
  }
}
main();`,
    },
    {
      id: "control-7",
      title: { en: "CONTROL FLOW — Ternary Operator", ar: "التحكم في التدفق — عامل الثلاثي (ternary)" },
      difficulty: "Medium",
      short: { en: "Use ternary operator for conditional output.", ar: "استخدم عامل الثلاثي لطباعة نتيجة شرطية." },
      description: { en: "Print 'Even' if number is even, else 'Odd' using ternary operator.", ar: "اطبع 'Even' إذا كان العدد زوجيًا، وإلا 'Odd' باستخدام العامل الثلاثي." },
      starter: `function main(){
  const num = 4;
  // Your code here
}
main();`,
      expected: "Even",
      objectives: { en: ["Use ternary operator", "Print correct output"], ar: ["استخدام العامل الثلاثي", "طباعة الناتج الصحيح"] },
      video: CHALLENGE_VIDEOS["control-7"],
      solution: `function main(){
  const num = 4;
  console.log(num % 2 === 0 ? "Even" : "Odd");
}
main();`,
    },
    {
      id: "control-8",
      title: { en: "CONTROL FLOW — Logical Operators", ar: "التحكم في التدفق — العوامل المنطقية" },
      difficulty: "Medium",
      short: { en: "Use logical operators in conditions.", ar: "استخدم العوامل المنطقية داخل الشروط." },
      description: { en: "Print 'Valid' if x > 0 and y < 10, else 'Invalid'.", ar: "اطبع 'Valid' إذا كان x > 0 و y < 10، وإلا اطبع 'Invalid'." },
      starter: `function main(){
  const x = 5;
  const y = 8;
  // Your code here
}
main();`,
      expected: "Valid",
      objectives: { en: ["Use && operator", "Print correct output"], ar: ["استخدام &&", "طباعة الناتج الصحيح"] },
      video: CHALLENGE_VIDEOS["control-8"],
      solution: `function main(){
  const x = 5;
  const y = 8;
  if(x > 0 && y < 10){
    console.log("Valid");
  } else {
    console.log("Invalid");
  }
}
main();`,
    },
  ],

  "data-structures": [
    {
      id: "data-1",
      title: { en: "DATA STRUCTURES — Objects Basics", ar: "هياكل البيانات — أساسيات الكائنات" },
      difficulty: "Easy",
      short: { en: "Create and print an object property.", ar: "أنشئ كائنًا واطبع خاصيةً منه." },
      description: { en: "Create an object with property `name` set to 'JS' and print it.", ar: "أنشئ كائنًا يحتوي الخاصية `name` بقيمة 'JS' واطبعها." },
      starter: `function main(){
  // Your code here
}
main();`,
      expected: "JS",
      objectives: { en: ["Create objects", "Access properties", "Print value"], ar: ["إنشاء كائنات", "الوصول إلى الخصائص", "طباعة القيمة"] },
      video: CHALLENGE_VIDEOS["data-1"],
      solution: `function main(){
  const obj = { name: "JS" };
  console.log(obj.name);
}
main();`,
    },
    {
      id: "data-2",
      title: { en: "DATA STRUCTURES — Maps", ar: "هياكل البيانات — الخرائط (Map)" },
      difficulty: "Medium",
      short: { en: "Create a Map and print a value.", ar: "أنشئ Map واطبع قيمةً منه." },
      description: { en: "Create a Map with key 'a' and value 1, then print the value for 'a'.", ar: "أنشئ Map بالمفتاح 'a' والقيمة 1 ثم اطبع قيمة 'a'." },
      starter: `function main(){
  // Your code here
}
main();`,
      expected: "1",
      objectives: { en: ["Create Map", "Set and get values", "Print value"], ar: ["إنشاء Map", "تعيين واسترجاع قيم", "طباعة القيمة"] },
      video: CHALLENGE_VIDEOS["data-2"],
      solution: `function main(){
  const map = new Map();
  map.set('a', 1);
  console.log(map.get('a'));
}
main();`,
    },
    {
      id: "data-3",
      title: { en: "DATA STRUCTURES — Sets", ar: "هياكل البيانات — المجموعات (Set)" },
      difficulty: "Medium",
      short: { en: "Create a Set and print its size.", ar: "أنشئ Set واطبع حجمه." },
      description: { en: "Create a Set with values 1,2,2,3 and print its size.", ar: "أنشئ Set بالقيم 1,2,2,3 واطبع حجمه." },
      starter: `function main(){
  // Your code here
}
main();`,
      expected: "3",
      objectives: { en: ["Create Set", "Add values", "Print size"], ar: ["إنشاء Set", "إضافة قيم", "طباعة الحجم"] },
      video: CHALLENGE_VIDEOS["data-3"],
      solution: `function main(){
  const set = new Set([1,2,2,3]);
  console.log(set.size);
}
main();`,
    },
    {
      id: "data-4",
      title: { en: "DATA STRUCTURES — Array Methods", ar: "هياكل البيانات — دوال المصفوفة" },
      difficulty: "Medium",
      short: { en: "Use array methods to transform data.", ar: "استخدم دوال المصفوفة لتحويل البيانات." },
      description: { en: "Given array [1,2,3], create a new array with each element doubled and print it.", ar: "مع المصفوفة [1,2,3]، أنشئ مصفوفة جديدة بحيث يتضاعف كل عنصر واطبعا." },
      starter: `function main(){
  const arr = [1,2,3];
  // Your code here
}
main();`,
      expected: "2,4,6",
      objectives: { en: ["Use map", "Transform array", "Print result"], ar: ["استخدام map", "تحويل المصفوفة", "طباعة النتيجة"] },
      video: CHALLENGE_VIDEOS["data-4"],
      solution: `function main(){
  const arr = [1,2,3];
  const doubled = arr.map(x => x * 2);
  console.log(doubled);
}
main();`,
    },
    {
      id: "data-5",
      title: { en: "DATA STRUCTURES — Destructuring", ar: "هياكل البيانات — التفكيك (Destructuring)" },
      difficulty: "Medium",
      short: { en: "Use destructuring to extract values.", ar: "استخدم التفكيك لاستخراج القيم." },
      description: { en: "Destructure array [10,20] into variables a and b and print their sum.", ar: "فكك المصفوفة [10,20] إلى المتغيرين a و b واطبع ناتج جمعهما." },
      starter: `function main(){
  const arr = [10,20];
  // Your code here
}
main();`,
      expected: "30",
      objectives: { en: ["Use destructuring", "Sum variables", "Print result"], ar: ["استخدام التفكيك", "جمع المتغيرات", "طباعة النتيجة"] },
      video: CHALLENGE_VIDEOS["data-5"],
      solution: `function main(){
  const arr = [10,20];
  const [a,b] = arr;
  console.log(a + b);
}
main();`,
    },
    {
      id: "data-6",
      title: { en: "DATA STRUCTURES — Spread and Rest", ar: "هياكل البيانات — الانتشار والباقي (Spread & Rest)" },
      difficulty: "Hard",
      short: { en: "Use spread operator to merge arrays.", ar: "استخدم عامل الانتشار لدمج المصفوفات." },
      description: { en: "Merge arrays [1,2] and [3,4] using spread and print the result.", ar: "ادمج المصفوفتين [1,2] و [3,4] باستخدام العامل ... واطبع النتيجة." },
      starter: `function main(){
  const arr1 = [1,2];
  const arr2 = [3,4];
  // Your code here
}
main();`,
      expected: "1,2,3,4",
      objectives: { en: ["Use spread operator", "Merge arrays", "Print result"], ar: ["استخدام عامل الانتشار", "دمج المصفوفات", "طباعة النتيجة"] },
      video: CHALLENGE_VIDEOS["data-6"],
      solution: `function main(){
  const arr1 = [1,2];
  const arr2 = [3,4];
  const merged = [...arr1, ...arr2];
  console.log(merged);
}
main();`,
    },
    {
      id: "data-7",
      title: { en: "DATA STRUCTURES — JSON", ar: "هياكل البيانات — JSON" },
      difficulty: "Medium",
      short: { en: "Parse JSON string and print a property.", ar: "حلل سلسلة JSON واطبع خاصية." },
      description: { en: "Parse JSON string '{\"name\":\"JS\"}' and print the name property.", ar: "حلل السلسلة '{\"name\":\"JS\"}' واطبع خاصية name." },
      starter: `function main(){
  const jsonStr = '{"name":"JS"}';
  // Your code here
}
main();`,
      expected: "JS",
      objectives: { en: ["Parse JSON", "Access properties", "Print value"], ar: ["تحليل JSON", "الوصول إلى الخصائص", "طباعة القيمة"] },
      video: CHALLENGE_VIDEOS["data-7"],
      solution: `function main(){
  const jsonStr = '{"name":"JS"}';
  const obj = JSON.parse(jsonStr);
  console.log(obj.name);
}
main();`,
    },
    {
      id: "data-8",
      title: { en: "DATA STRUCTURES — Iterators", ar: "هياكل البيانات — المكررات (Iterators)" },
      difficulty: "Hard",
      short: { en: "Use iterator to print array elements.", ar: "استخدم المكرر لطباعة عناصر المصفوفة." },
      description: { en: "Use iterator to print elements of array [5,6,7].", ar: "استخدم المكرر لطباعة عناصر المصفوفة [5,6,7]." },
      starter: `function main(){
  const arr = [5,6,7];
  // Your code here
}
main();`,
      expected: "5\n6\n7",
      objectives: { en: ["Use iterator", "Print elements"], ar: ["استخدام المكرر", "طباعة العناصر"] },
      video: CHALLENGE_VIDEOS["data-8"],
      solution: `function main(){
  const arr = [5,6,7];
  const iterator = arr[Symbol.iterator]();
  let result = iterator.next();
  while(!result.done){
    console.log(result.value);
    result = iterator.next();
  }
}
main();`,
    },
  ],

  "functions-scope": [
    {
      id: "functions-1",
      title: { en: "FUNCTIONS & SCOPE — Function Basics", ar: "الدوال والنطاق — أساسيات الدوال" },
      difficulty: "Easy",
      short: { en: "Define and call a function.", ar: "عرف دالة واستدعها." },
      description: { en: "Define a function `greet` that prints 'Hi' and call it.", ar: "عرف دالة `greet` تطبع 'Hi' ثم استدعها." },
      starter: `// Your code here`,
      expected: "Hi",
      objectives: { en: ["Define function", "Call function", "Print output"], ar: ["تعريف دالة", "استدعاء الدالة", "طباعة الناتج"] },
      video: CHALLENGE_VIDEOS["functions-1"],
      solution: `function greet(){
  console.log("Hi");
}
greet();`,
    },
    {
      id: "functions-2",
      title: { en: "FUNCTIONS & SCOPE — Arrow Functions", ar: "الدوال والنطاق — الدوال السهمية (Arrow)" },
      difficulty: "Medium",
      short: { en: "Rewrite function as arrow function.", ar: "أعد كتابة دالة كدالة سهمية." },
      description: { en: "Rewrite function `add` that sums two numbers as an arrow function and print result of add(2,3).", ar: "أعد كتابة الدالة `add` التي تجمع رقمين كدالة سهمية واطبع نتيجة add(2,3)." },
      starter: `// Your code here`,
      expected: "5",
      objectives: { en: ["Use arrow functions", "Print result"], ar: ["استخدام الدوال السهمية", "طباعة النتيجة"] },
      video: CHALLENGE_VIDEOS["functions-2"],
      solution: `const add = (a,b) => a + b;
console.log(add(2,3));`,
    },
    {
      id: "functions-3",
      title: { en: "FUNCTIONS & SCOPE — Closures", ar: "الدوال والنطاق — الإغلاق (Closures)" },
      difficulty: "Hard",
      short: { en: "Create a closure that adds a fixed number.", ar: "انشئ إغلاقًا (closure) يضيف رقمًا ثابتًا." },
      description: { en: "Create a function `makeAdder` that returns a function adding a fixed number. Use it to add 5 to 10 and print result.", ar: "اكتب دالة `makeAdder` تعيد دالة تضيف رقمًا ثابتًا. استخدمها لإضافة 5 إلى 10 واطبع النتيجة." },
      starter: `// Your code here`,
      expected: "15",
      objectives: { en: ["Create closures", "Return functions", "Print result"], ar: ["انشاء closures", "إرجاع دوال", "طباعة النتيجة"] },
      video: CHALLENGE_VIDEOS["functions-3"],
      solution: `function makeAdder(x){
  return function(y){
    return x + y;
  }
}
const add5 = makeAdder(5);
console.log(add5(10));`,
    },
    {
      id: "functions-4",
      title: { en: "FUNCTIONS & SCOPE — Callbacks", ar: "الدوال والنطاق — الاستدعاءات (Callbacks)" },
      difficulty: "Medium",
      short: { en: "Use a callback function.", ar: "استخدم دالة رد نداء (callback)." },
      description: { en: "Write a function `process` that takes a callback and calls it with 'Done'.", ar: "اكتب دالة `process` تأخذ callback وتستدعيها مع 'Done'." },
      starter: `// Your code here`,
      expected: "Done",
      objectives: { en: ["Use callbacks", "Call functions"], ar: ["استخدام callbacks", "استدعاء الدوال"] },
      video: CHALLENGE_VIDEOS["functions-4"],
      solution: `function process(callback){
  callback("Done");
}
process(console.log);`,
    },
    {
      id: "functions-5",
      title: { en: "FUNCTIONS & SCOPE — Promises", ar: "الدوال والنطاق — الوعود (Promises)" },
      difficulty: "Hard",
      short: { en: "Create and resolve a Promise.", ar: "انشئ Promise وحلّه." },
      description: { en: "Create a Promise that resolves with 'Success' and print the resolved value.", ar: "انشئ Promise يحل بـ 'Success' واطبع القيمة بعد الحل." },
      starter: `// Your code here`,
      expected: "Success",
      objectives: { en: ["Create Promise", "Handle resolve", "Print value"], ar: ["انشاء Promise", "معالجة الحل", "طباعة القيمة"] },
      video: CHALLENGE_VIDEOS["functions-5"],
      solution: `const p = new Promise((resolve) => {
  resolve("Success");
});
p.then(console.log);`,
    },
    {
      id: "functions-6",
      title: { en: "FUNCTIONS & SCOPE — Async/Await", ar: "الدوال والنطاق — async/await" },
      difficulty: "Hard",
      short: { en: "Use async/await to handle Promise.", ar: "استخدم async/await للتعامل مع Promise." },
      description: { en: "Create async function that awaits a Promise resolving 'Done' and prints it.", ar: "اكتب دالة async تنتظر Promise يحل بـ 'Done' وتطبعه." },
      starter: `// Your code here`,
      expected: "Done",
      objectives: { en: ["Use async/await", "Handle Promise", "Print value"], ar: ["استخدام async/await", "معالجة Promise", "طباعة القيمة"] },
      video: CHALLENGE_VIDEOS["functions-6"],
      solution: `async function main(){
  const p = new Promise(resolve => resolve("Done"));
  const result = await p;
  console.log(result);
}
main();`,
    },
    {
      id: "functions-7",
      title: { en: "FUNCTIONS & SCOPE — Function Scope", ar: "الدوال والنطاق — نطاق الدالة" },
      difficulty: "Medium",
      short: { en: "Demonstrate function scope.", ar: "بيّن نطاق المتغير داخل الدالة." },
      description: { en: "Declare a variable inside a function and print it. Outside the function, print 'undefined'.", ar: "علن متغيرًا داخل دالة واطبعه. خارج الدالة اطبع 'undefined' إن لم يكن موجودًا." },
      starter: `// Your code here`,
      expected: "Inside\nundefined",
      objectives: { en: ["Understand scope", "Print variables"], ar: ["فهم النطاق", "طباعة المتغيرات"] },
      video: CHALLENGE_VIDEOS["functions-7"],
      solution: `function test(){
  let x = "Inside";
  console.log(x);
}
test();
console.log(typeof x === "undefined" ? "undefined" : x);`,
    },
    {
      id: "functions-8",
      title: { en: "FUNCTIONS & SCOPE — Higher Order Functions", ar: "الدوال والنطاق — الدوال عالية المستوى" },
      difficulty: "Hard",
      short: { en: "Create a function that takes another function.", ar: "اكتب دالة تستقبل دالة أخرى." },
      description: { en: "Write a function `apply` that takes a function and a value, applies the function to the value and prints the result.", ar: "اكتب دالة `apply` تستقبل دالةً وقيمةً وتطبق الدالة على القيمة ثم تطبع النتيجة." },
      starter: `// Your code here`,
      expected: "20",
      objectives: { en: ["Use higher order functions", "Print result"], ar: ["استخدام الدوال عالية المستوى", "طباعة النتيجة"] },
      video: CHALLENGE_VIDEOS["functions-8"],
      solution: `function apply(fn, val){
  console.log(fn(val));
}
apply(x => x * 2, 10);`,
    },
  ],
};

export default challengesData;