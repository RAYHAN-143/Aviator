let balance = 1000.00; // প্রাথমিক ব্যালেন্স
let betAmount = 0;
let currentMultiplier = 1.00;
let isPlaying = false;
let crashPoint = 0;
let interval;

const multiplierDisplay = document.getElementById('multiplier');
const balanceDisplay = document.getElementById('balance');
const betInput = document.getElementById('betAmount');
const placeBetButton = document.getElementById('placeBetButton');
const cashoutButton = document.getElementById('cashoutButton');
const messageDisplay = document.getElementById('message');

// ব্যালেন্স আপডেট করার ফাংশন
function updateBalance(amount) {
    balance += amount;
    balanceDisplay.textContent = `ব্যালেন্স: ${balance.toFixed(2)} BDT`;
}

// একটি এলোমেলো ক্র্যাশ পয়েন্ট তৈরি করা (একটি সরলীকৃত উদাহরণ)
function generateCrashPoint() {
    // 1.00 থেকে শুরু করে একটি র্যান্ডম পয়েন্ট
    // একটি র্যান্ডম সংখ্যা (0 থেকে 1)
    const random = Math.random(); 
    // একটি সহজ লিনিয়ার ফাংশন যা প্রায় 1.00 থেকে 10.00 এর মধ্যে ক্র্যাশ পয়েন্ট দেয়
    // Note: আসল গেমগুলিতে এটি আরও জটিল 'Provably Fair' অ্যালগরিদম ব্যবহার করে।
    crashPoint = Math.max(1.00, 100 / (100 - (random * 98)));
    return parseFloat(crashPoint.toFixed(2));
}

// গেম শুরু করার ফাংশন
function startGame() {
    if (isPlaying) return;

    const amount = parseFloat(betInput.value);
    if (amount <= 0 || amount > balance || isNaN(amount)) {
        messageDisplay.textContent = 'অবৈধ বাজি বা অপর্যাপ্ত ব্যালেন্স।';
        return;
    }
    
    betAmount = amount;
    updateBalance(-betAmount); // বাজি থেকে টাকা কাটা
    isPlaying = true;
    currentMultiplier = 1.00;
    crashPoint = generateCrashPoint();

    multiplierDisplay.textContent = '1.00x';
    messageDisplay.textContent = 'বিমান উড়ছে...';
    placeBetButton.disabled = true;
    cashoutButton.disabled = false;

    // মাল্টিপ্লায়ার বৃদ্ধি শুরু করা
    interval = setInterval(updateGame, 100); // 100ms পর পর আপডেট
}

// গেম আপডেট করার ফাংশন
function updateGame() {
    if (!isPlaying) {
        clearInterval(interval);
        return;
    }

    // প্রতিবার 0.01 করে মাল্টিপ্লায়ার বাড়ানো 
    currentMultiplier += 0.01; 
    multiplierDisplay.textContent = `${currentMultiplier.toFixed(2)}x`;

    // ক্র্যাশ হয়েছে কি না পরীক্ষা করা
    if (currentMultiplier >= crashPoint) {
        multiplierDisplay.textContent = `${crashPoint.toFixed(2)}x (CRASHED!)`;
        messageDisplay.textContent = `দুঃখিত! ${crashPoint.toFixed(2)}x এ ক্র্যাশ করেছে। আপনি হেরে গেছেন।`;
        endGame(false);
    }
}

// ক্যাশ আউট করার ফাংশন
function cashOut() {
    if (!isPlaying) return;

    const winnings = betAmount * currentMultiplier;
    updateBalance(winnings);
    messageDisplay.textContent = `ক্যাশ আউট সফল! ${currentMultiplier.toFixed(2)}x এ জিতেছেন ${winnings.toFixed(2)} BDT।`;
    endGame(true);
}

// গেম শেষ করার ফাংশন
function endGame(didWin) {
    isPlaying = false;
    clearInterval(interval);
    placeBetButton.disabled = false;
    cashoutButton.disabled = true;
    // গেমের পরবর্তী রাউন্ডের জন্য প্রস্তুত
}

// ইভেন্ট লিসেনার যোগ করা
placeBetButton.addEventListener('click', startGame);
cashoutButton.addEventListener('click', cashOut);

// শুরুতে ব্যালেন্স প্রদর্শন করা
updateBalance(0); 
