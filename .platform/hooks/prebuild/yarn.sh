#!/bin/bash
# need to install node first to be able to install yarn (as at prebuild no node is present yet)
curl --silent --location https://rpm.nodesource.com/setup_16.x | bash -
yum -y install nodejs
# install yarn
wget https://dl.yarnpkg.com/rpm/yarn.repo -O /etc/yum.repos.d/yarn.repo
yum -y install yarn
yum -y install jq
