"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const readline = __importStar(require("readline"));
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
function question(prompt) {
    return new Promise((resolve) => {
        rl.question(prompt, (answer) => {
            resolve(answer);
        });
    });
}
function fetchInstantSpeedCards(manaValue) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Fetch instant-speed cards with the specified mana value
            // Using Scryfall API to get all permanents with instant speed
            const query = `t:instant mv:${manaValue} -is:digital -is:funny`;
            const url = `https://api.scryfall.com/cards/search?q=${encodeURIComponent(query)}&unique=cards`;
            const response = yield fetch(url);
            const data = (yield response.json());
            const cardMap = new Map();
            if (data.data && Array.isArray(data.data)) {
                for (const card of data.data) {
                    cardMap.set(card.name.toLowerCase(), {
                        name: card.name,
                        mana_value: card.mana_value,
                        type_line: card.type_line,
                    });
                }
            }
            return cardMap;
        }
        catch (error) {
            console.error("Error fetching cards from Scryfall:", error);
            return new Map();
        }
    });
}
function normalizeCardName(name) {
    return name
        .toLowerCase()
        .trim()
        .replace(/[^\w\s'-]/g, "")
        .replace(/\s+/g, " ");
}
function runGame() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        console.log("🎴 Magic: The Gathering - What Do They Have? 🎴\n");
        console.log("Learn instant-speed cards by mana value!\n");
        const manaValue = Math.floor(Math.random() * 5) + 1; // 1-5 mana
        console.log(`\n⚡ You have ${manaValue} mana available.`);
        console.log("What instant-speed cards could your opponent play with this mana?\n");
        // Fetch the reference cards
        const correctCards = yield fetchInstantSpeedCards(manaValue);
        if (correctCards.size === 0) {
            console.log("Could not fetch card data. Please check your internet connection.");
            rl.close();
            return;
        }
        console.log(`Hint: There are ${correctCards.size} instant-speed cards at this mana value.\n`);
        const userCards = [];
        console.log('Enter card names one by one (type "done" when finished, or "give up" for the answer):\n');
        while (true) {
            const input = yield question(`Card ${userCards.length + 1}: `);
            if (input.toLowerCase() === "done" || input.toLowerCase() === "quit") {
                break;
            }
            if (input.toLowerCase() === "give up") {
                userCards.push("GIVE_UP");
                break;
            }
            if (input.trim()) {
                userCards.push(input);
            }
        }
        console.log("\n" + "=".repeat(50));
        console.log("📊 RESULTS\n");
        if (userCards.includes("GIVE_UP")) {
            userCards.pop(); // Remove the "GIVE_UP" marker
        }
        // Check user's answers
        let correctCount = 0;
        const correctAnswers = Array.from(correctCards.keys()).sort();
        const userAnswersNormalized = userCards.map(normalizeCardName);
        console.log("✅ You got right:");
        for (const userInput of userAnswersNormalized) {
            for (const [cardName] of correctCards) {
                if (normalizeCardName(cardName) === userInput) {
                    console.log(`  • ${(_a = correctCards.get(cardName)) === null || _a === void 0 ? void 0 : _a.name}`);
                    correctCount++;
                    correctCards.delete(cardName);
                    break;
                }
            }
        }
        console.log("\n❌ You missed:");
        for (const [cardName, card] of correctCards) {
            console.log(`  • ${card.name}`);
        }
        console.log(`\n📈 Score: ${correctCount}/${correctCount + correctCards.size}`);
        console.log("=".repeat(50) + "\n");
        // Ask if they want to play again
        const playAgain = yield question("Play again? (y/n): ");
        if (playAgain.toLowerCase() === "y") {
            console.log("\n".repeat(5));
            yield runGame();
        }
        else {
            console.log("Thanks for playing! Keep studying those instant-speed cards! 🎴");
            rl.close();
        }
    });
}
// Run the game
runGame().catch(console.error);
