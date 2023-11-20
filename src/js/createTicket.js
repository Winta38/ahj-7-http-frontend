import requestToServer from './requestToServer';

export default class createTicket {
    constructor(parent) {
        this.parent = parent;
        this.container = null;
        this.form = null;
        this.name = null;
        this.id = null;
        this.status = false;
        this.description = null;
    }

    init() {
        this.container = document.createElement('div');
        this.container.classList.add('create-form');
        const form = `
    <h4>Добавить тикет</h4>
    <label>Краткое описание
      <input type="text" data-name="name" required>
    </label>
    <label>Подробное описание</label>
    <textarea data-name="description" rows="2" required></textarea>
    <div class="button">
    <button class="button-reset" type="reset">Отмена</button>
    <button class="button-ok" type="submit">Ok</button>
    </div>`;
        this.container.innerHTML = form;
        document.body.appendChild(this.container);
        this.form = document.querySelector('.create-form');
        this.reset = this.form.querySelector('.button-reset');
        this.submit = this.form.querySelector('.button-ok');
        this.reset.addEventListener('click', this.onReset.bind(this));
        this.submit.addEventListener('click', this.onSubmit.bind(this));
    }

    show() {
        this.container.classList.add('active');
    }

    onReset(e) {
        e.preventDefault();
        this.container.classList.remove('active');
    }

    async onSubmit(e) {
        e.preventDefault();
        this.name = this.form.querySelector('[data-name="name"]');
        this.description = this.form.querySelector('[data-name="description"]');
        this.params = {
            data: {
                method: 'createTicket',
                id: this.id,
                status: this.status,
                name: this.name.value,
                description: this.description.value,
            },
            method: 'POST',
        };
        try {
            this.parent.rawTicket(await requestToServer(this.params));
        } catch (error) {
            console.log(error);
        }
        this.container.classList.remove('active');
    }
}