---
layout: posts
title: "Analyze Docker images"
tags: docker
classes: wide
description: "In this blog post different tools to analyze docker images get introduced. We take a look at docker on board tools, dive and portainer."
---

When working with docker, it can be useful to take a closer look into a docker image. E.g for debugging purpose or because you have a docker image from an untrusted source and you want to check what happens inside the docker image before running it as a container. In this blog post I want to take a closer look into some tools that I used for this purpose.

I decided to analyze the image `maven:3.9.5-eclipse-temurin-11`. Please note, that the docker images tags can be reused. That means the actual docker image behind a tag can change. This is a common practice to provide an updated image without forcing the user of this image to update the image tag he uses. For this article it is relevant, that you might see slightly different results, if you analyze the image with the tag `maven:3.9.5-eclipse-temurin-11`, because it is actually a newer, updated version.

Here is a section from the Dockerfile that belongs to the image we will analyze. The complete Dockerfile can be found in the [docker-maven git repository on GitHub](https://github.com/carlossg/docker-maven/blob/ce7950e684a067136fa6dfa810193a0ca7e78ad7/eclipse-temurin-11/Dockerfile).

But before we start analyzing the image, let's pull it by running `docker pull maven:3.9.5-eclipse-temurin-11`. This might take a few seconds until the image is downloaded.

## Docker on board tool

The docker cli provides the `history` command, that helps us to see the different layers;

```bash
~ docker history maven:3.9.5-eclipse-temurin-11
IMAGE          CREATED       CREATED BY                                      SIZE      COMMENT
ad74783bc599   2 weeks ago   CMD ["mvn"]                                     0B        buildkit.dockerfile.v0
<missing>      2 weeks ago   ENTRYPOINT ["/usr/local/bin/mvn-entrypoint.s…   0B        buildkit.dockerfile.v0
<missing>      2 weeks ago   ENV MAVEN_CONFIG=/root/.m2                      0B        buildkit.dockerfile.v0
<missing>      2 weeks ago   ARG USER_HOME_DIR=/root                         0B        buildkit.dockerfile.v0
<missing>      2 weeks ago   ARG MAVEN_VERSION=3.9.5                         0B        buildkit.dockerfile.v0
<missing>      2 weeks ago   RUN /bin/sh -c ln -s ${MAVEN_HOME}/bin/mvn /…   24B       buildkit.dockerfile.v0
<missing>      2 weeks ago   COPY settings-docker.xml /usr/share/maven/re…   327B      buildkit.dockerfile.v0
<missing>      2 weeks ago   COPY mvn-entrypoint.sh /usr/local/bin/mvn-en…   1.65kB    buildkit.dockerfile.v0
<missing>      2 weeks ago   COPY /usr/share/maven /usr/share/maven # bui…   10.9MB    buildkit.dockerfile.v0
<missing>      2 weeks ago   ENV MAVEN_HOME=/usr/share/maven                 0B        buildkit.dockerfile.v0
<missing>      2 weeks ago   RUN /bin/sh -c apt-get update   && apt-get i…   63.1MB    buildkit.dockerfile.v0
<missing>      7 days ago    /bin/sh -c #(nop)  CMD ["jshell"]               0B
<missing>      7 days ago    /bin/sh -c #(nop)  ENTRYPOINT ["/__cacert_en…   0B
<missing>      7 days ago    /bin/sh -c #(nop) COPY file:8b8864b3e02a33a5…   1.18kB
<missing>      7 days ago    /bin/sh -c set -eux;     echo "Verifying ins…   0B
<missing>      7 days ago    /bin/sh -c set -eux;     ARCH="$(dpkg --prin…   278MB
<missing>      7 days ago    /bin/sh -c #(nop)  ENV JAVA_VERSION=jdk-11.0…   0B
<missing>      7 days ago    /bin/sh -c set -eux;     apt-get update;    …   36.1MB
<missing>      3 weeks ago   /bin/sh -c #(nop)  ENV LANG=en_US.UTF-8 LANG…   0B
<missing>      3 weeks ago   /bin/sh -c #(nop)  ENV PATH=/opt/java/openjd…   0B
<missing>      3 weeks ago   /bin/sh -c #(nop)  ENV JAVA_HOME=/opt/java/o…   0B
<missing>      4 weeks ago   /bin/sh -c #(nop)  CMD ["/bin/bash"]            0B
<missing>      4 weeks ago   /bin/sh -c #(nop) ADD file:63d5ab3ef0aab308c…   77.8MB
<missing>      4 weeks ago   /bin/sh -c #(nop)  LABEL org.opencontainers.…   0B
<missing>      4 weeks ago   /bin/sh -c #(nop)  LABEL org.opencontainers.…   0B
<missing>      4 weeks ago   /bin/sh -c #(nop)  ARG LAUNCHPAD_BUILD_ARCH     0B
<missing>      4 weeks ago   /bin/sh -c #(nop)  ARG RELEASE                  0B

```

The commands that you see in the `CREATED BY` column can also be found in the Dockerfile of the image, but the order is reversed. `CMD ["mvn"]` is the first line from the table of the `docker history` output and the last line in the Dockerfile. More commands follow. But the line `7 days ago    /bin/sh -c #(nop)  CMD ["jshell"]` is not in our Dockerfile. It comes from the image `maven:3.9.5-eclipse-temurin-11` is based on.

One issue you probably saw already is, that some commands are truncated and the overall readability of the output is not great. You can adjust the output format a bit (run `docker history --help` for options). But honestly, I found the `docker history` command not the best tool for the analysis, since it output format is limited and with longer commands it does not give a great human readable overview. Let's see, if we find other tools.

# dive

One of my favorite tools is [dive](https://github.com/wagoodman/dive). It's a command line tool that is quite easy to use thanks to it's keyboard navigation and well structured layout. Let's dive into our docker image be running `dive maven:3.9.5-eclipse-temurin-11`.

![Console output of the dive for the analysis of a docker image.](/assets/images/posts/2023-12-07_analyze_docker-dive.png "dive maven:3.9.5-eclipse-temurin-11")

In the bottom line, you see the most important commands to navigate through the different views, to filter the output and more. I recommend to look into the dive GitHub repository (linked above) to learn more about the key bindings.

On the left top section named `Layers`, we can select the different layer of the image that we can look into. Underneath are some `Layer Detail` and at the bottom are `Image Details`. On the right side we see the `Layer Contents`.

When we start `dive`, the `Layers` section is active. We can navigate with the up and down arrows through the different layers. If we switch to another layer, the `Layer Details` will change respectively. With `Ctrl + A` (A = aggregated) and `Ctrl + L` (L = layer), we can choose to see only the changes of the current layer in the right view or to see the aggregated changes of the current and all underlying layers.

With `Tab`, we can switch to the right layer contents view (and back). Here we can navigate through the file tree of the image and see which directories have been changed.

If you build a docker image yourself,the `Image efficiency score` in the `Image Details` might be interesting, if you want to optimize your image size. You can even integrate `dive` into your CI pipeline to check the image efficiency during your builds. See [dive - CI Integration](https://github.com/wagoodman/dive#ci-integration) for details.

# Portainer

The third tool I want to look into is [Portainer](https://www.portainer.io/). Portainer is container management software, that is also available in a free Community Edition. It is not a tool specialized in analyzing images and has a much wider scope. But it is my preferred GUI tool for docker on Linux and if you look for graphic tool instead of command lines tool it is worth a try.

For our current use case, I run portainer as a standalone docker setup. I recommend a look into the [official documentation for installing portainer](https://docs.portainer.io/start/install-ce/server/docker).

Once installed and set up, we can open Portainer in our preferred browser. In my case by calling https://localhost:9443. After selecting our local environment, we can navigate to `Images` in the left navigation menu and we will see a list of all docker images available on our system:

![Screenshot of portainer with an overview of the available docker images on our local system](/assets/images/posts/2023-12-07_analyze_docker-portainer_image_overview.png "Overview of available docker images")

Once we click on the ID of our `maven` image, we can see some details of the image. Ths includes the tags, some image details (like its ID or size) and the different layers as you can see in this following screenshots:

![Screenshot of portainer with details about different layers of a docker image](/assets/images/posts/2023-12-07_analyze_docker-portainer_image_details.png "Image Layer")

# Summary

There are different tools to analyze docker images. The docker onboard tools are a bit limited but `dive` is an excellent command line tools. Users that prefer graphical interfaces can give `Portainer` a try.
