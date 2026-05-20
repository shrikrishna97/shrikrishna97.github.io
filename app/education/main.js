new Vue({
    el: '#app',
    data: {
        educationalJourney: [
            {
                title: 'B.Sc. (Hons.) in Mathematics',
                institution: 'Govt. T.R.S College, Rewa, MP',
                year: '2015 – 2018',
                description: 'Three-year honours degree in Mathematics. Built a strong foundation in calculus, linear algebra, statistics, and real analysis.'
            },
            {
                title: 'Foundational Level Certificate',
                institution: 'IIT Madras — BS in Data Science & Applications',
                year: '2020 - 2021',
                description: 'Completed the Foundational Level of the IIT Madras BS programme, covering Statistics, Maths, Computational Thinking, and English.'
            },
            {
                title: 'Diploma in Programming',
                institution: 'IIT Madras — BS in Data Science & Applications',
                year: '2021 - 2022',
                description: 'Earned the Programming Diploma, covering System Commands, Database Management, Java, and Application Development.'
            },
            {
                title: 'Diploma in Data Science',
                institution: 'IIT Madras — BS in Data Science & Applications',
                year: '2022 - 2023',
                description: 'Earned the Data Science Diploma, covering Machine Learning Foundations, Business Data Management, Tools in Data Science, and MLT.'
            },
            {
                title: 'BS in Data Science & Applications',
                institution: 'IIT Madras',
                year: '2023 - 2024',
                description: 'Completed the full BS Degree with an overall CGPA of 8.79. Received the Diploma Certificate at SAC Auditorium, IIT Madras. Final courses included Software Engineering, Application Development II, and Capstone project.'
            }
        ],
        experiences: [
            {
                title: 'Course Instructor — IIT Madras',
                org: 'IIT Madras BS Program',
                period: '2024 – Present',
                description: 'Teaching Computational Thinking, Application Development I & II, Software Engineering, and their Lab Courses. Conducted on-campus offline bootcamps and workshops.',
                repoLinks: [
                    { label: '📘 Computational Thinking', url: 'https://github.com/shrikrishna97/Computational-Thinking' },
                    { label: '📗 App Dev Resources', url: 'https://github.com/shrikrishna97/Resources-App-Dev' },
                ]
            },
            {
                title: 'Teaching Assistant',
                org: 'IIT Madras',
                period: '2023 - 2024',
                description: 'Taken live sessions, handled thousands of level1 vivas, taken hundreds of level1/level2 vivas for App Dev courses.',
            },
            {
                title: 'Teaching Assistant & Education Mentor',
                org: 'IIT Madras',
                period: '2022',
                description: 'Mentored 300+ students in System Commands. Managed a WhatsApp community (10,000+), LinkedIn group (900+ members)',
                repoLinks: [
                    { label: '💻 System Commands Notes', url: 'https://github.com/shrikrishna97/System-Commands-Notes_May22' }
                ]
            },
            {
                title: 'ML Supervised Classification Project',
                org: 'IIT Madras — Kaggle Competition',
                period: '2022',
                description: 'Achieved accuracy of 0.65 in a Sales Prediction project, ranking 42nd out of 760 teams. Used Numpy, Pandas, XGBoost, Sklearn.',
                repoLinks: []
            },
            {
                title: 'Business Data Management Capstone',
                org: 'IIT Madras',
                period: '2022',
                description: 'Data collection, cleaning, preparation, and dashboard creation for a kirana firm. Developed a recommendation system and Streamlit app (MKP Store Analysis).',
                repoLinks: []
            }
        ],
        skills: [
            'Python', 'Java', 'C', 'JavaScript', 'Vue.js', 'React', 'Flask', 'Django',
            'SQL', 'SQLite', 'PostgreSQL', 'Redis', 'Celery', 'Node.js',
            'Machine Learning', 'Scikit-learn', 'XGBoost', 'PyTorch',
            'Pandas', 'Numpy', 'Tableau', 'Excel',
            'Linux / Bash', 'Awk', 'Sed', 'Git', 'Bootstrap'
        ],
        currentFocus: 'Software Engineering, Full-Stack Development, and teaching Data Science & Application Development at IIT Madras.',
        lookingFor: 'SDE / Full-Stack Developer roles or Research/Teaching positions in Computer Science and Data Science.'
    }
});
