# What Do They Have? 🎴

A Magic: The Gathering training tool to help you learn instant-speed cards by mana requirement.

## How it works

1. The tool displays a random mana requirement (e.g., {W}{U}{B})
2. You enter all instant-speed cards that could be cast with that exact mana
3. The tool checks your answers against local card data
4. You get scored on how many correct cards you identified

## Setup

Just open `index.html` in your web browser! No build process needed.

Alternatively, you can use a local server:

```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Node.js (with http-server)
npx http-server
```

Then navigate to `http://localhost:8000`

## Gameplay

1. **View Mana Requirement**: See the colored mana symbols at the top
2. **Enter Cards**: Type instant-speed card names one at a time
3. **Add to List**: Click "Add Card" or press Enter
4. **Submit or Give Up**: 
   - Click "Done" to submit your answers
   - Click "Give Up" to see all correct answers
5. **See Results**: View cards you got right, missed, and your score
6. **Play Again**: Start a new round

## Features

- ✅ Visual mana display with color-coded symbols
- ✅ Uses local card data (Marvel Super Heroes set)
- ✅ Fuzzy card name matching (handles spelling variations)
- ✅ Beautiful, responsive web interface
- ✅ Instant feedback on answers
- ✅ No internet required (except initial page load)

## Card Data

- Uses `data/cards.json` which contains Scryfall card data
- Filters only Instant-type cards
- Shows all playable options for each mana combination


## Customization

To adapt this to different card sets:
1. Export card data from Scryfall (JSON format with `type_line` and `mana_cost` fields)
2. Replace `data/cards.json` with your new dataset
3. Refresh the browser

## Future Improvements

- Set filtering (play with specific sets)
- Difficulty levels (restrict to common/uncommon cards)
- Statistics tracking across sessions
- Multiplayer mode
- Limited format simulation

