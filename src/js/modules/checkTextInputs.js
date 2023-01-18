const checkTextInputs = (selector) => {
    const txtInputs = document.querySelectorAll(selector);

    txtInputs.forEach(item => {
        item.addEventListener('input', () => {
            item.value = item.value.replace(/[a-z]/gim, '');
          });
        });
};

export default checkTextInputs;