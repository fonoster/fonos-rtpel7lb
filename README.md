# Fonos RTPEL7LB

> A layer 7 load balancer to serve ng control protocol requests to rtpengine servers

![publish to docker](https://github.com/fonoster/fonos-rtpel7lb/workflows/publish%20to%20docker%20hub/badge.svg)

This load balancer aims to assist in scaling the media traffic in a VoIP network deployment. It purposely uses the NG Control Protocol to allow for a "drop-in" replacement of RTPEngine.

For more documentation on how Fonos images are constructed and how to work with them, please see the [documentation](https://github.com/fonoster/fonos).

## Available Versions

You can see all images available to pull from Docker Hub via the [Tags](https://hub.docker.com/repository/registry-1.docker.io/fonoster/fonos-rtpel7lb/tags?page=1) page. Docker tag names that begin with a "change type" word such as task, bug, or feature are available for testing and may be removed at any time.

## Installation

You can clone this repository and manually build it.

```
cd fonoster/fonos-rtpel7lb\:%%VERSION%%
docker build -t fonoster/fonos-rtpel7lb:%%VERSION%% .
```

Otherwise you can pull this image from docker index.

```
docker pull fonoster/fonos-rtpel7lb:%%VERSION%%
```

## Usage Example

The following is a basic example of using this image.

```
docker run ...
```

## Image Specs

- [ ] Receive request using the NG Control Protocol and forward to RTPEngine instances
- [ ] Implement an admin interface (Restful API)
- [ ] Implement loadbalancing using a round-robin algorithm 

The admin interface must implement PUSH, GET, and DELETE methods. 

## Environment Variables

Environment variables are used in the entry point script to render configuration templates. You can specify the values of these variables during `docker run`, `docker-compose up`, or in Kubernetes manifests in the `env` array.

{Each environment variable might have 1-2 sentences of description. If it needs longer than that, it should probably have a sub-section within Features to elaborate.}

- `AGI_URL` - Agi Endpoint. **Required**
- `SIPPROXY_HOST` - Proxy's IP address

## Exposed ports

- `5060` - Default SIP port
- `5061` - Default SIP port for TLS signaling
- `5062` - Default SIP port for TLS support

## Volumes

- `/your/file/location` - File location
- `/some/special/script.sh` - List special scripts

## Useful File Locations

- `/some/special/script.sh` - List special scripts
- `/magic/dir` - And also directories

## Contributing

Please read [CONTRIBUTING.md](https://github.com/fonoster/fonos/blob/master/CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## Authors

- [Pedro Sanders](https://github.com/psanders)

See also the list of contributors who [participated](https://github.com/fonoster/rtpel7lb/contributors) in this project.

## License

Copyright (C) 2020 by Fonoster Inc. MIT License (see [LICENSE](https://github.com/fonoster/fonos/blob/master/LICENSE) for details).
