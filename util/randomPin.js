function pin (number_of_digits) {
    let max = parseInt(new Array(number_of_digits).fill(9).join(""));
    let min = Math.pow(10, number_of_digits - 2);

    return Math.floor(Math.random() * (max - min + 1) + min)
}


module.exports = {
    pin: pin
}