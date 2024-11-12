'use strict';

document.addEventListener('DOMContentLoaded', () => {
    let currentSign = '';
    let prevDigit = 0;
    let currentDigit = 0;
    let oneDigitflag = true;
    let decimal = false;
    let clearDisabled = false;
    const signChanger = sign => currentSign = sign;

    const calc = document.getElementById('calc');
    const currentInput = calc.querySelector('.calc__display .current');
    const displayUPD = value => currentInput.innerText = value;

    const fontWidthCorrection = () => {
        let inputWidth = currentInput.getBoundingClientRect().width;

        if (inputWidth > 315) {
            while (true) {
                const style = getComputedStyle(currentInput).fontSize;
                const fontSize = parseFloat(style);

                currentInput.style.fontSize = `${fontSize - 1}px`;
                inputWidth = currentInput.getBoundingClientRect().width;

                if (inputWidth <= 315) {
                    break;
                }
            }
        }
    }

    const fullInput = calc.querySelector('.calc__display .full');
    const digitBtns = calc.querySelectorAll('.digit-btn');

    digitBtns.forEach(btn => {
        btn.addEventListener('click', e => {
            const digit = e.target.dataset.digit;

            if (oneDigitflag) {
                if (!decimal) {
                    displayUPD(digit);
                    currentDigit = +digit;
                } else {
                    const concatNumber = currentDigit + digit;
                    displayUPD(concatNumber);
                    currentDigit = concatNumber;
                }

                oneDigitflag = false;
            } else {
                const concatNumber = currentDigit + digit;
                const locale = !decimal
                    ? (+concatNumber).toLocaleString()
                    : concatNumber;

                if (concatNumber.length <= 16) {
                    displayUPD(locale);
                    currentDigit = concatNumber;

                    fontWidthCorrection();
                }
            }
        });
    });

    const formula = (result, text) => {
        displayUPD(result);
        fullInput.innerText = `${text}(${currentDigit})`;
        currentDigit = result;
    }

    const actions = {
        'C': () => {
            currentSign = '';
            currentDigit = 0;
            prevDigit = 0;
            oneDigitflag = true;
            decimal = false;
            fullInput.innerText = '';
            displayUPD(0);
            currentInput.style.fontSize = '55px';
            clearDisabled = false;
        },
        'CE': () => {
            currentDigit = 0;
            displayUPD(0);
            currentInput.style.fontSize = '55px';
            clearDisabled = false;
        },
        '<': () => {
            if (!clearDisabled) {
                const toShort = currentDigit.length > 1
                    ? currentDigit.substring(0, currentDigit.length - 1)
                    : '0';

                setTimeout(() => {
                    currentInput.style.fontSize = '55px';
                    fontWidthCorrection();
                }, 10);

                displayUPD(!decimal
                    ? (+toShort).toLocaleString()
                    : toShort
                );

                if (toShort.indexOf('.') === -1) {
                    decimal = false;
                }

                currentDigit = toShort;
            }
        },
        'sqrt': () => {
            const result = Math.sqrt(currentDigit);
            formula(result, 'sqrt');
            fontWidthCorrection();
            clearDisabled = true;
        },
        'sqr': () => {
            const result = +(currentDigit**2);
            formula(result, 'sqr');
            fontWidthCorrection();
            clearDisabled = true;
        },
        '1/x': () => {
            const result = 1 / currentDigit;
            formula(result, '1/');
            fontWidthCorrection();
            clearDisabled = true;
        },
        '+/-': () => {
            currentDigit *= -1;
            displayUPD(currentDigit);
        },
        '.': () => {
            currentDigit = `${currentDigit}.`;
            decimal = true;
            displayUPD(currentDigit);
        },
        '%': () => {
            const result = prevDigit * currentDigit / 100;
            displayUPD(result);
            currentDigit = result;
        },
    };

    const actionBtns = calc.querySelectorAll('.action-btn');
    actionBtns.forEach(btn => {
        btn.addEventListener('click', e => {
            const sign = e.currentTarget.dataset.sign;

            if (!actions[sign]) {
                signChanger(sign);

                prevDigit += +currentDigit;

                fullInput.innerText = `${+prevDigit} ${currentSign}`;

                oneDigitflag = true;
                decimal = false;

                currentDigit = prevDigit;
                displayUPD(prevDigit);
            } else {
                actions[sign]();
            }

            fontWidthCorrection();
        });
    });

    const equals = {
        '+': () => (+prevDigit) + (+currentDigit),
        '-': () => prevDigit - currentDigit,
        '*': () => prevDigit * currentDigit,
        '/': () => prevDigit / currentDigit,
    };

    const equalBtn = calc.querySelector('#equal');
    equalBtn.addEventListener('click', () => {
        const result = equals[currentSign]();
        fullInput.innerText = `${+prevDigit} ${currentSign} ${+currentDigit} =`;
        currentDigit = result;
        prevDigit = 0;
        displayUPD(+result.toFixed(10));
        oneDigitflag = true;
        decimal = false;
        fontWidthCorrection();
    });
});
