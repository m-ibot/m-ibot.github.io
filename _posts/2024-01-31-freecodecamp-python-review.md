---
layout: posts
title: "Scientific Computing with Python certificate on freecodecamp.org - Review"
tags: python certificate review
classes: wide
description: "I just finished the Scientific Computing with Python certificate by freeCodeCamp and this is my personal review."
---

## Intro

Just yesterday, I got my certificate for [Scientific Computing with Python (Beta)](https://www.freecodecamp.org/learn/scientific-computing-with-python/) on [freeCodeCamp](https://freecodecamp.org). I want to use this chance to give a personal review of the certificate I got.

I wanted to take a closer look into [python programming language](https://www.python.org/) for a while already, but never found the time and motivation for it. Other things simply had a higher priority for me. This changed a few weeks ago and I was looking for a good source to learn python. After short googling I found several python certificates on freeCodeCamp. The certificate structure looked good for me - more about that later - so I just registered and directly jumped in. But before I give you details about the certificate itself, let's take a closer look at freeCodeCamp.

freeCodeCamp is a public charity and offers free resources and certificates to people who want to learn programming and become a software developer. freeCodeCamp claims that ten thousands of freeCodeCamp graduates found jobs at some of the worlds biggest tech companies. I do not want to evaluate this claim, but they do not say if they got the job because of freeCodeCamp's courses and what kind of jobs these people got. At least where I live and work - in Germany - official degrees and certifications are high valued and I'm afraid it might be quite difficult to find a job as software developer with only freeCodeCamp's certificates. But this does not mean, it can't be a good resource to learn certain skills.

freeCodeCamp does not only provide a [whole curriculum](https://www.freecodecamp.org/learn/) of certificates, but also a [YouTube channel](https://www.youtube.com/@freecodecamp) with hundreds of videos. The curriculum covers topics like responsive web design, algorithm and data structures, relational databases, quality assurance, information security and more. I'm not good at learning from watching videos only and most of the freeCodeCamp certificates are currently not of bigger interest for me. Therefore I can't review freeCodeCamp's whole set of learning resources. But I can say something about the one certificate I finished.

## Structure and content

The python certificate "Scientific Computing with Python" that I choose is not the only available python class, but it was the one that sounded most appealing to me. There is also "Data Analysis with Python", "Machine Learning with Python" and "College Algebra with Python". Furthermore, some of the other certificates include courses that use python. The certificates are all self-pace classes. Therefore one can take as much time as they need to study and get the certificate. The basic structure of all the certificate classes seems to be more or less the same.

It starts with some interactive courses for learning the required skills. These are optional, so one could skip them if they have the knowledge already and just want to get a certificate. There is also a [freeCodeCamp Forum](https://forum.freecodecamp.org/) where you can ask for help if you are stuck or do need further explanation for a topic. For every certificate some projects have to be completed and after completing these one can claim their certificate itself.

### Courses

The courses cover topics like string manipulation, numbers, lambdas, lists, regex, algorithm design, recursion, data structures and classes and objects. During each class one will build a small program from the beginning to the end and in this progress more and more language features get introduced.

If you have a bit of programming experience you will see that these are quite basic topics and programming concepts. But that's what I do expect from a course for learning a new programming language. If you learn something new, I start at the beginning. And what I really love about the course is that I could interactively learn practically write and execute code. To give you a better impression about it, let's take a look at a screenshot of one of the exercises:

![UI for the interactive course. Exercise/task and code editor ar on the left. On the right, output of the program is shown in a terminal.](/assets/images/posts/2024-01-31_interactive_course.png "freeCodeCamp interactive python course")

This screenshot shows step 55 of the first course, "Learn String Manipulation by Building a Cipher". On the left, there is a short description what we need to do in this step, the code editor with the already written code and a button to check the code that we changed in this step. On the right there is a terminal with the output of the program. After successfully checking the code, we can proceed to the next step.

I usually can read and understand most the code of a for me unknown programming language and if I have enough code as reference it is not to difficult to adjust or copy existing code to build something new. But I often have the feeling that this does not really help me to understand, remember and learn it in a way, that I could write good code in this language on my own. It's similar with just watching video tutorials to learn a language. For videos I have to write the code myself on the same time to really remember things. But then I often watch a video on stop and go to write the code and sometimes I need to jump back a few seconds if I did not understand something correctly. While I see videos, written tutorials, articles and existing code good additional resources to deeper understand concepts, this interactive approach of free freeCodeCamp feels like the best way for me to remember a new languages syntax because I need to think about the possible solution and write the code. In addition it's nice to have a small but complete program at the end of every course. It feels more like a success than just writing a for loop for the purpose of writing a for loop. The finished program is like a small reward I got after each class.

But I have also found some smaller downsides. The single steps were sometimes to small for me and I had to get used to not think to much in advance and to follow the instructions very exactly. Quite often the next steps where very obvious I tended to do them in one step. This might be "problem" others with programming experience might run into as well. One example could be to calculate a new value and then add it to an existing list. But if the current step of the course requires only calculating the value, the check will fail if I add it to the list already. It then gets appended to the list in the next step. Furthermore a very exact solution is mostly required. Even if I already learned different ways to achieve the same goal during the course, only on is accepted as the correct solution for one step. But these are rather small annoyances.

I used the forum only a couple few times to read there about possible solutions when I really got stuck. While the community seemed to be quite helpful and nice, solutions for course steps are not allowed to be posted there, even if you can just skip to the next step of o course and see the solution from the previous step there. This is a bit hypocritical and leads to the point where it's easier to skip a step and review and try understand the provided solution than ask in the forum why the correct solution works.

### Projects

Once you finished the courses, you can move on to the projects. The projects are required to claim the certificate later. For each project a program has to be write. In case of the "Scientific Computing with Python" these projects are an "Arithmetic Formatter", "Time Calculator", "Budget App", "Polygon Area Calculator" and "Probability Calculator". The description of the projects explain exactly how to set up the projects and what needs to be implemented and all the projects can be completed with the skills learned during the courses. Here one does not get guided from step to step anymore. Instead one has to find the correct solution themselves.

What is the correct solution? Well, one that passes all tests. The projects are implemented on [replit.com](https://replit.com/), an in-Browser IDE and runtime environment. That makes the setup very easy and once I registered on replit I could start each project in less than a minute. Each project - which will get cloned from a GitHub repository into replit - contains an several file of which four are interesting for the user. The `README.md` just links to the project instructions on freecodecamp.org. The `main.py` is the entry point to the program and contains some example code and it calls the tests that need to run successfully. A third file contains all the tests. And last but not least, there is one file where the code has to be implemented.

![replit ide for project implementation. Existing files are shown on the left, code editor in the center and a terminal with the program output on the right. At the op is a run button to execute the programm](/assets/images/posts/2024-01-31_replit_ui.png "replit ui for freeCodeCamp's projects")

Developers who have seen some IDEs will quickly find one's way around in this UI. The existing files are shown on the left. The center contains a code editor with files opened in tabs. The right side displays the output of the program in a terminal. And on top of all this is run button to execute the code.

Implementing the projects was another fun part. With some development experience and the python skills learned in the courses was quite easy and not to challenging.

One thing that bothered me a tiny little bit was the formatting of the output, which often took as much time as the rest of the program to get the correct number of spaces and line breaks since these get checked by the tests as well.

Furthermore the project descriptions did not fit to one adjustments on replit's UI anymore. It states the following as one step to set up a project:

> Select `Use run command` and click the `Done` button

But now, more correct would be:

> Enter `python3 main.py` and click the `Done` button

It might be obvious to python developers how to run a python program, but not to someone who tries to runs a python program for the first time.

Once a project is finished, it has to be submitted by providing a link to the implementation on replit. Once this was done, I could finally claim my certificate!

### The certificate

After completing the projects I finally got my certificate and here it is: [{{ site.author.name }} - Scientific Computing with Python Certificate](https://www.freecodecamp.org/certification/m-ibot/scientific-computing-with-python-v7)

You might wonder if nobody is checking if the projects are really implemented correctly. The answer is, nobody has to but everybody can. Underneath the certificate you will finds links to the implemented projects and you can report a user if you feel that he did not implement the projects correctly or just copied someone elses code. But claiming the certificate itself is based on trust. Basically, the freeCodeCamp community has to review itself. I think the main reason for this is, that freeCodeCamp targets to provide all learning resources and these certificates for free. But having people whose job it is just to review and check the code of all the projects would be quite time consuming and costly.

The certificate also states "representing approximately 300 hours of work". I did not measure the time I used for this certificate but I would estimate between 50 and 75 hours. This of course depends on previous knowledge, but someones who has programming skills and knowledge already can complete the certificate without doubt in far less then 300 hours.

What is the certificate worth? It's hard to estimate. But I can say for sure, nobody is a professional python programmer or scientific computing expert by just completing this certificate.

## Summary

I really enjoyed working on this python certificate. I was looking for a fun way to learn some python basics and get a first impression of the language during my free time. And this is what I got with this certificate. I really liked the interactive approach during the courses and implementing the projects. Furthermore I'm even more motivated to improve my python skills now because I like the language. I could also imagine using freeCodeCamp.org again if I want to study something that is covered by one of their certificates. Overall I'm quite happy with the result.

It was not my objective to become a professional python developer. Therefore I do not need a certificate to proof my python skills for a job (I added the certificate to my LinkedIn profile anyway ;)) or similar. But I have to admit once I started working on it, it was also a motivation factor to finish the certificate.

I feel like the title of the certificate sound more than it actually is. I'm not a scientific computing or python expert now. Sure, the links of the implemented projects underneath the certificate shows represent it's level, but I'm not sure if people who see the certificate will also check what's behind it or just judge it by it's title. If someone wants to become a python developer, this certificate can be a first step, but there is so much more to learn to achieve this objective.
