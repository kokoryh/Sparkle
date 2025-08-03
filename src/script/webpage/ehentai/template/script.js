window.onload = function () {
    const userBlackList = ['峡谷轮椅人'];
    const keywordBlackList = [];
    const c1Elements = document.querySelectorAll('.c1');
    for (let i = 0; i < c1Elements.length; i++) {
        const element = c1Elements[i];
        const score = Number(element.querySelector('.c5 > span')?.innerText);
        const username = element.querySelector('.c3 > a')?.innerText;
        const comment = element.querySelector('.c6')?.innerText;
        if (score < 0) {
            element.style.display = 'none';
        }
        if (userBlackList.includes(username)) {
            element.style.display = 'none';
        }
        if (keywordBlackList.some(keyword => comment.includes(keyword))) {
            element.style.display = 'none';
        }
    }
};
