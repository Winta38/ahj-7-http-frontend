import requestToServer from './requestToServer';

export default class deleteTicket {
    constructor(parent) {
        this.parent = parent;
        this.id = null;
        this.container = null;
    }

    init() {
        this.container = document.createElement('div');
        this.container.classList.add('delete-form');
        const form = `<h4>Добавить тикет</h4>
      <p>Вы уверены, что хотите удалить тикет? Это действие необратимо.</p>
      <div class="button">
        <button class="button-reset" type="reset">Отмена</button>
        <button class="button-delete" type="submit">Ok</button>
    </div>`;
        this.container.innerHTML = form;
        document.body.appendChild(this.container);
        this.form = document.querySelector('.delete-form');
        this.reset = this.form.querySelector('.button-reset');
        this.submit = this.form.querySelector('.button-delete');
        this.reset.addEventListener('click', this.onReset.bind(this));
        this.submit.addEventListener('click', this.onDelete.bind(this));
    }

    show(id) {
        this.id = id;
        this.container.classList.add('active');
    }

    onReset(e) {
        e.preventDefault();
        this.container.classList.remove('active');
    }

    async onDelete(e) {
        e.preventDefault();
        this.params = {
            data: {
                method: 'deleteTicket',
                id: this.id,
            },
            method: 'DELETE',
        };
        try {
            this.parent.rawTicket(await requestToServer(this.params));
        } catch (error) {
            console.log(error);
        }
        this.container.classList.remove('active');
    }
}