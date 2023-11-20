import requestToServer from './requestToServer';

export default class editTicket {
    constructor(parent) {
        this.parent = parent;
        this.container = null;
        this.form = null;
        this.name = null;
        this.id = null;
        this.status = false;
        this.description = null;
        this.created = null;
    }

    init() {
        this.container = document.createElement('div');
        this.container.classList.add('edit-form');
        const form = `
    <h4>Изменить тикет</h4>
    <label>Краткое описание
      <input type="text" data-name="name" required>
    </label>
    <label>Подробное описание</label>
    <textarea data-name="description" rows="2" required></textarea>
    <div class="button">
    <button class="button-reset" type="reset">Отмена</button>
    <button class="button-edit" type="submit">Ok</button>
    </div>`;
        this.container.innerHTML = form;
        document.body.appendChild(this.container);
        this.form = document.querySelector('.edit-form');
        this.reset = this.form.querySelector('.button-reset');
        this.edit = this.form.querySelector('.button-edit');
        this.reset.addEventListener('click', this.onReset.bind(this));
        this.edit.addEventListener('click', this.onEdit.bind(this));
    }

    async show(ticket) {
        this.id = ticket.dataset.index;
        this.name = ticket.querySelector('span').textContent;
        this.ticket = await this.parent.getDescription(this.id);
        this.description = this.ticket.description;
        this.status = this.ticket.status;
        this.created = this.ticket.created;
        this.container.querySelector('input').value = this.name;
        this.container.querySelector('textarea').value = this.description;
        this.container.classList.add('active');
    }

    onReset(e) {
        e.preventDefault();
        this.container.classList.remove('active');
    }

    async onEdit(e) {
        e.preventDefault();
        this.name = this.container.querySelector('input').value;
        this.description = this.container.querySelector('textarea').value;
        this.params = {
            data: {
                method: 'editTicket',
                id: this.id,
                status: this.status,
                name: this.name,
                description: this.description,
                created: this.created,
            },
            method: 'PUT',
        };
        try {
            this.parent.rawTicket(await requestToServer(this.params));
        } catch (error) {
            console.log(error);
        }
        this.container.classList.remove('active');
    }
}