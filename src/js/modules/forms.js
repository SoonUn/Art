// import checkNumInputs from './checkNumInputs';

const forms = () => {
    const form = document.querySelectorAll('form'),
          inputs = document.querySelectorAll('input'),
          upload = document.querySelectorAll('[name="upload"]');

        // checkNumInputs('input[name="user_phone"]');

    const message = {
        loading: 'Загузка...',
        failure: 'Что-то пошло не так...',
        success: 'Спасибо! Скоро мы с вами свяжемся',
        spinner: 'assets/img/spinner.gif',
        ok: 'assets/img/ok.png',
        fail: 'assets/img/fail.png'
    };

    const path = {
        designer : 'assets/server.php',
        question: 'assets/question.php'
    };

    const postData = async (url, data) => {
        let res = await fetch(url, {
            method: 'POST',
            body: data
        });

        return await res.text();
    };

    const clearInputs = () => {
        inputs.forEach(item => {
            item.value = '';
        });
        upload.forEach(item => {
            item.previousElementSibling.textContent = 'Файл не выбран';
        });
    };

    upload.forEach(item => {
        item.addEventListener('input', () => {
            console.log(item.files[0]);
            let dots;
            const arr = item.files[0].name.split('.');
            
            arr[0].length > 6 ? dots = '...' : dots = '.';//jshint ignore:line
            const name = arr[0].substring(0, 6) + dots + arr[1];
            item.previousElementSibling.textContent = name;
        });
    });

    const fileInputs = document.querySelectorAll('[name="upload"]');

    fileInputs.forEach(input => {
        input.addEventListener('drop', (e) => {
            input.files = e.dataTransfer.files;

            let dots;
            const arr = input.files[0].name.split('.');
            
            arr[0].length > 6 ? dots = '...' : dots = '.';//jshint ignore:line
            const name = arr[0].substring(0, 6) + dots + arr[1];
            input.previousElementSibling.textContent = name;

            if (input.closest('.main')) {

                const formData = new FormData();
                formData.append('file', input.files[0]);

                postData('assets/server.php', formData)
                    .then(res => {
                        console.log(res);
                    })
                    .catch(() => {
                        console.log('Error');
                    })
                    .finally(() => {
                        clearInputs();
                    });
                    
            }
        });
    });

    form.forEach(item => {
        item.addEventListener('submit', (e) => {
            e.preventDefault();
            
            let statusMessage = document.createElement('div');
            statusMessage.classList.add('status');
            item.parentNode.appendChild(statusMessage);

            item.classList.add('animated', 'fadeOutUp');
            setTimeout(() => {
                item.style.display = 'none';
            }, 400);

            let statusImg = document.createElement('img');
            statusImg.setAttribute('src', message.spinner);
            statusImg.classList.add('animated', 'fadeInUp');
            statusMessage.appendChild(statusImg);

            let textMessage = document.createElement('div');
            textMessage.textContent = message.loading;
            statusMessage.appendChild(textMessage);

            const formData = new FormData(item);
                let api;
                item.closest('.popup-design') || item.classList.contains('calc_form')  ? api = path.designer : api = path.question; //jshint ignore:line
                console.log(api);

            postData(api, formData)
            .then(res => {
                console.log(res);
                statusImg.setAttribute("src", message.ok);
                textMessage.textContent = message.success;
            })
            .catch(() => {
                textMessage.textContent = message.failure;
                statusImg.setAttribute("src", message.fail);
            })
            .finally(() => {
                clearInputs();
                setTimeout(() => {
                    statusMessage.remove();
                    item.style.display = 'block';
                    item.classList.remove('fadeOutUp');
                    item.classList.add('fadeInUp');
                }, 5000);
            });
        });
    });
};

export default forms;