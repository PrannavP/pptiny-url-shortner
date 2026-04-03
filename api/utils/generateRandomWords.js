function generateRandomWord(){
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    let randomWord = '';
  
    for (let i = 0; i < 6; i++) {
        const randomIndex = Math.floor(Math.random() * alphabet.length);
        randomWord += alphabet[randomIndex];
    };
  
    return randomWord;
};

module.exports = generateRandomWord;