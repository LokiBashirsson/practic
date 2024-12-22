class Api {
    async takeAllVakancies(sortBy = 'title', sortOrder = 'asc') {
        const url = new URL('http://127.0.0.1:5000/api/vacancies');
        url.search = new URLSearchParams({ sort_by: sortBy, sort_order: sortOrder }).toString();
        const response = await fetch(url);
        return response.json();
    }

    async addNewVakancy(title: string | undefined, price: number, description: string | undefined, company_name: string | undefined) {
        const a = await fetch('http://127.0.0.1:5000/api/vacancies', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: title,
                price: price,
                description: description,
                posted_at: new Date().toLocaleDateString(),
                company_name: company_name
            })
        })
        return a.status
    }

    async searchVacancies(query: string, sortBy: string, sortOrder: string) {
        const response = await fetch('http://127.0.0.1:5000/api/vacancies/search?' + new URLSearchParams({
            query,
            sort_by: sortBy,
            sort_order: sortOrder
        }).toString(), {
            method: 'GET',
        });
        return response.json();
    }

    async deleteThisVakancy(username: string) {
        const a = await fetch('http://127.0.0.1:5000/api/user/' + username);
    }

    async regIn(username: string, email: string, password: string, role: string) {
        const a = await fetch(`http://127.0.0.1:5000/api/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: username,
                email: email,
                password: password,
                role: role,
            })
        })
        return a.status
    }

    async logIn(username: string, password: string) {
        const a = await fetch('http://127.0.0.1:5000/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: username,
                password: password
            })
        })
        return a.json()
    }

    async takeMyData(token: string) {
        const a = await fetch('http://127.0.0.1:5000/api/me', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
        })
        return a.json()
    }








    async getAllResumes() {
        const url = 'http://127.0.0.1:5000/api/resumes';

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const resumes = await response.json();
        console.log('Resumes:', resumes);
        return resumes;
    }
    async addNewResume(resumeData: any) {
        const url = 'http://127.0.0.1:5000/api/resumes';

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(resumeData),
        });

        const result = await response.json();
        console.log('Resume added successfully:', result);
        return result;
    }
}

export default new Api();