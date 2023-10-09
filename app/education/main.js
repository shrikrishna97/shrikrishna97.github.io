new Vue({
    el: '#app',
    data: {
        educationalJourney: [
            {
                title: 'Diploma in Data Science and Programming',
                institution: 'IIT Madras',
                description: 'Earned a diploma in Data Science and Programming from IIT Madras.'
            },
            // Add more educational milestones
        ],
        experiences: [
            {
                title: 'ML Supervised Classification Project',
                description: 'Achieved an accuracy score of 0.65 in a Sale Prediction project, ranking 42nd out of 760 teams. Utilized Numpy, Pandas, Xgboost, Sklearn, and Kaggle.'
            },
            {
                title: 'Business Data Management Project',
                description: 'Handled data collection, cleaning, preparation, and created dashboards. Developed a recommendation system and insights. Created a Streamlit application for a kirana firm.'
            },
            // Add more work experiences
        ],
        skills: [
            'Python',
            'Java',
            'Awk',
            'Sed',
            'Linux-based utilities',
            'Machine Learning Algorithms',
            'Deep Learning',
            'AI',
            'Market Research',
            // Add more skills
        ],
        currentFocus: 'Software Engineering and Testing with Linear Statistical Models',
        lookingFor: 'Internship Role in Programming or Data Science'
    }
});
