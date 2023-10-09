Vue.component('project-list', {
    props: ['projects'],
    template: `
        <div>
            <h2 class="text-center mb-4">Internship Projects</h2>
            <div class="row">
                <div class="col-md-4" v-for="(project, index) in projects" :key="index">
                    <div class="card mb-4 project-card" style="animation: fadeInUp 1s ease;">
                        <img :src="project.image" class="card-img-top project-image" alt="Project Image">
                        <div class="card-body">
                            <h5 class="card-title">{{ project.title }}</h5>
                            <p class="card-text">{{ project.description }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
});

new Vue({
    el: '#app',
    data: {
        projects: [
            {
                title: 'Project 1',
                description: 'Description of Project 1',
                image: 'components/certificate photo.jpg'
            },
            {
                title: 'Project 2',
                description: 'Description of Project 2',
                image: 'components/certificate photo.jpg'
            },
            {
                title: 'Project 3',
                description: 'Description of Project 3',
                image: 'components/certificate photo.jpg'
            }
        ]
    }
});
