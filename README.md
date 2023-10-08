## Inspiration
&nbsp;&nbsp;&nbsp;&nbsp; As engineering students, we have seen the constant toll many of our peers go through due to overworking and stress that leads to bad mental health. Many college students are simply too focused on academics or professional development to consider the potential problems they are facing. Therefore, we created **Psy-ki(気)**. The app encourages users to take note of their well-being and mark a rating and reflection for each day with a calendar feature. After a week, our AI will attempt to analyze the data and assist the user on how they can improve their mental health and well-being.

## What it does
&nbsp;&nbsp;&nbsp;&nbsp; **Psy-ki(気)** provides its users with both qualitative and quantitative ways to measure and analyze their mental health. Our web app allows users to seamlessly enter reflections of their days along with a rating of it through our integrated calendar system. It uses that data to analyze your day-to-day struggles and possibly provide advice for the user depending on the input.
&nbsp;&nbsp;&nbsp;&nbsp; The app also allows the user to talk about their problem with our chatbot programmed with the user's mental health and well-being in mind. All conversations with the chatbot are session-based and are never saved to an external database to create virtual client-patient confidentiality.

## How we built it
&nbsp;&nbsp;&nbsp;&nbsp; To build out the app we used a combination of React, Flask, and MongoDB. React was the framework we decided to use on the front end due to its ability to adapt to different components and its ease of interfacing with APIs on the client side. *henry maybe fill more here*
&nbsp;&nbsp;&nbsp;&nbsp; We relied on Flask for the back end and mainly used it to set up multiple RestAPI endpoints to facilitate communication between the client and server side. The Flask app also handles most of the API calls to OpenAI which we used for our mental health analysis and chatbot. Lastly, Flask aided with storing user information in MongoDB. I stored both qualitative and quantitative entered into the calendar for our AI to analyze and display a summary on the profile page.

## Challenges we ran into
&nbsp;&nbsp;&nbsp;&nbsp; Initially, we were planning to integrate MindsDB into our MongoDB database to train a model based on the user's rating and reflections in the database itself. Unfortunately, the MindsDB website was unresponsive for most of the hackathon and would not let us log in without displaying an error. Therefore, we pivoted toward OpenAI API to analyze the data, and instead of integrating it within the database, we integrated it within the backend.
&nbsp;&nbsp;&nbsp;&nbsp; Another thorn in our side throughout the entire development process was CORS. React would occasionally throw CORS errors, and we would have to think of new ways to manage our communication from client-side to server-side. One workaround that worked for us was implementing our chatbot feature entirely through the client side.

## Accomplishments that we're proud of
&nbsp;&nbsp;&nbsp;&nbsp; Though we had to rework many of our features to be implemented another way than we originally attended, we still managed to create every feature we set out to through one method or another. Though the trials and tribulations may have taken hours on end to complete, we were able to persevere.
&nbsp;&nbsp;&nbsp;&nbsp; We were also able to keep our app simple and scalable. Sometimes when a work-a-round is required for certain implementations, it unnecessarily complicates the project and makes it both more inefficient and unscaleable. We were able to keep everything relatively simple allowing our app to grow.

## What we learned
&nbsp;&nbsp;&nbsp;&nbsp; Through this project, we learned more technical skills especially how to work better with machine learning APIs. We were able to fully code our chatbot solely using React with no other Python code, unlike any other machine learning implementations. We also learned how to facilitate our own way of communicating between client-side and server-side code without necessarily relying heavily on middleware. This allowed us to use frameworks and languages we were comfortable with without detering from the project.

## What's next for Psy-ki(気)
&nbsp;&nbsp;&nbsp;&nbsp; We aim to arm college student with the ability to look out for their mental health in a hassle-free and convenient way. Hopefully, with the help of our web app, students' statistics for depression and other mental health-related problems can start to plummet.