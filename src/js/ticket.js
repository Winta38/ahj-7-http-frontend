import requestToServer from './requestToServer';
import createTicket from './createTicket';
import deleteTicket from './deleteTicket';
import editTicket from './editTicket';

export default class Ticket {
    constructor(element) {
        this.element = element;
    }

    async init() {
        this.createForm = new createTicket(this);
        this.createForm.init();
        this.deleteForm = new deleteTicket(this);
        this.deleteForm.init();
        this.editForm = new editTicket(this);
        this.editForm.init();
        this.params = {
            data: {
                method: 'allTickets',
            },
            method: 'GET',
        };
        try {
            this.rawTicket(await requestToServer(this.params));
        } catch (e) {
            console.log(e);
        }
        this.element.addEventListener('click', this.showFormDelete.bind(this));
        this.element.addEventListener('click', this.showFormCreate.bind(this));
        this.element.addEventListener('click', this.showDescription.bind(this));
        this.element.addEventListener('click', this.getStatus.bind(this));
        this.element.querySelector('.create-ticket').addEventListener('click', this.createNewTicket.bind(this));
    }

    createNewTicket(e) {
        e.preventDefault();
        this.createForm.show(e.target);
    }

    showFormDelete(e) {
        e.preventDefault();
        if (e.target.classList.contains('delete-ticket')) {
            const ticket = e.target.closest('li');
            this.deleteForm.show(ticket.dataset.index);
        }
    }

    showFormCreate(e) {
        e.preventDefault();
        if (e.target.classList.contains('edit-ticket')) {
            const ticket = e.target.closest('li');
            this.editForm.show(ticket);
        }
    }

    async showDescription(e) {
        e.preventDefault();
        if (!e.target.classList.contains('text')) {
            return;
        }
        const ticket = e.target.closest('li');
        if (ticket.querySelector('.description')) {
            ticket.querySelector('.description').remove();
            return;
        }
        const id = ticket.dataset.index;
        const getTicket = await this.getDescription(id);
        const formDescription = `
      <p class='description'>${getTicket.description}</p>`;
        ticket.insertAdjacentHTML('beforeend', formDescription);
    }

    async getStatus(e) {
        e.preventDefault(e);
        if (!e.target.classList.contains('button-status')) {
            return;
        }
        const ticket = e.target.closest('li');
        const id = ticket.dataset.index;
        this.status = null;
        const button = ticket.querySelector('.button-status');
        if (button.classList.contains('done')) {
            this.status = false;
        } else {
            this.status = true;
        }
        const getTicket = await this.getDescription(id);
        const params = {
            data: {
                method: 'editTicket',
                id: getTicket.id,
                status: this.status,
                name: getTicket.name,
                description: getTicket.description,
                created: getTicket.created,
            },
            method: 'PUT',
        };
        try {
            this.rawTicket(await requestToServer(params));
        } catch (error) {
            console.log(error);
        }
    }

    rawTicket(response) {
        const tickets = this.element.querySelector('.tickets');
        tickets.innerHTML = '';
        response.forEach((ticket) => {
            const { id, name, status, created } = ticket;
            const data = this.dateToString(created);
            const content = `<li class="ticket" data-index="${id}">
        <button class="button-status"></button>
        <span class="text">${name}</span>
        <span class="create">${data}</span>
        <button class="edit-ticket"></button>
        <button class="delete-ticket">X</button>
        </li>`;
            tickets.insertAdjacentHTML('beforeend', content);
            if (status === true) {
                const getTicket = tickets.querySelector(`[data-index="${id}"]`);
                getTicket.querySelector('.button-status').classList.add('done');
            }
        });
    }

    dateToString(time) {
        const date = new Date(time);
        const result = date.toLocaleString('ru-Ru', {
            year: '2-digit',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        });
        return result.replace(/[,%]/g, '');
    }

    async getDescription(id) {
        this.params = {
            data: {
                method: 'ticketById',
                id,
            },
            method: 'GET',
        };
        try {
            return await requestToServer(this.params);
        } catch (error) {
            console.log(error);
        }
    }
}