# RTPEL7LB

> A layer 7 load balancer for RTPEngine.

![publish to docker](https://github.com/fonoster/fonos-rtpel7lb/workflows/publish%20to%20docker%20hub/badge.svg)

This load balancer aims to assist in scaling the media traffic in a VoIP network. It uses the [NG Control Protocol (NGCP)](https://github.com/sipwise/rtpengine#the-ng-control-protocol) to allow for a "drop-in" replacement of RTPEngine.

![Highlevel ARQ](https://raw.githubusercontent.com/fonoster/fonos-rtpel7lb/main/diagram.png "RTPEL7LB, high-level diagram")

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
docker run -it \
    -p 22222:22222 \
    fonoster/fonos-rtpel7lb
```

## Specs

This service implement the following the following:

- [ ] Query Consul for registered RTPEngines 
- [ ] Receive NGCP requests and forward those requests to instances of RTPEngine
- [ ] Load balance NGCP traffic using a round-robin algorithm

## Environment Variables

Environment variables are used in the entry point script to render configuration templates. You can specify the values of these variables during `docker run`, `docker-compose up`, or in Kubernetes manifests in the `env` array.

- `NG_PORT` - Port to listen for NGCP requests from Routr, OpenSIPS, Kamailio, etc. Defaults to `22222`
- `CONSUL_ADDR` - A string in form of `host:port` with the hostname and port of Consul server. **Required**
- `CONSUL_REFRESH_TIMEOUT` - Time in seconds to refresh the list of boxes from Coonsul. Defaults to `30`

## Exposed ports

- `22222` - Default NG Control Protocol Port

## Contributing

Please read [CONTRIBUTING.md](https://github.com/fonoster/fonos/blob/master/CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## Authors

- [Hector Ventura](https://github.com/hectorvent)
- [Pedro Sanders](https://github.com/psanders)

See also the list of contributors who [participated](https://github.com/fonoster/fonos-rtpel7lb/contributors) in this project.

## License

Copyright (C) 2020 by Fonoster Inc. MIT License (see [LICENSE](https://github.com/fonoster/fonos/blob/master/LICENSE) for details).
