#!/usr/bin/env bash

set -euo pipefail

source .buildkite/scripts/common/util.sh

.buildkite/scripts/bootstrap.sh

# unset env vars defined in other parts of CI for automatic APM collection of
# Kibana. We manage APM config in our FTR config and performance service, and
# APM treats config in the ENV with a very high precedence.
unset ELASTIC_APM_ENVIRONMENT
unset ELASTIC_APM_TRANSACTION_SAMPLE_RATE
unset ELASTIC_APM_SERVER_URL
unset ELASTIC_APM_SECRET_TOKEN
unset ELASTIC_APM_ACTIVE
unset ELASTIC_APM_CONTEXT_PROPAGATION_ONLY
unset ELASTIC_APM_ACTIVE
unset ELASTIC_APM_SERVER_URL
unset ELASTIC_APM_SECRET_TOKEN
unset ELASTIC_APM_GLOBAL_LABELS

GCS_ARTIFACTS_DIR="gcs_artefacts"
SCALABILITY_ARTIFACTS_LOCATION="$WORKSPACE/$GCS_ARTIFACTS_DIR"
GCS_BUCKET="gs://kibana-performance/scalability-tests"

# These tests are running on static workers so we have to make sure we delete previous build of Kibana
rm -rf "$KIBANA_BUILD_LOCATION"
rm -rf "$SCALABILITY_ARTIFACTS_LOCATION"

mkdir -p "$SCALABILITY_ARTIFACTS_LOCATION"

echo "--- Downloading the latest scalability artifacts..."

gsutil cp "$GCS_BUCKET/LATEST" "$SCALABILITY_ARTIFACTS_LOCATION/"
HASH=`cat $SCALABILITY_ARTIFACTS_LOCATION/LATEST`
gsutil cp -r "$GCS_BUCKET/$HASH" "$SCALABILITY_ARTIFACTS_LOCATION/"

echo "--- Cloning kibana-load-testing repo and preparing workspace"
mkdir -p kibana-load-testing && cd kibana-load-testing

if [[ ! -d .git ]]; then
  git init
  git remote add origin https://github.com/elastic/kibana-load-testing.git
fi
git fetch origin --depth 1 "main"
git reset --hard FETCH_HEAD

KIBANA_LOAD_TESTING_GIT_COMMIT="$(git rev-parse HEAD)"
export KIBANA_LOAD_TESTING_GIT_COMMIT

echo "--- Unziping kibana build, plugins and scalability traces..."
cd "$WORKSPACE"
mkdir -p "$KIBANA_BUILD_LOCATION"
tar -xzf "$GCS_ARTIFACTS_DIR/$HASH/kibana-default.tar.gz" -C "$KIBANA_BUILD_LOCATION" --strip=1

cd "$KIBANA_DIR"
tar -xzf "../$GCS_ARTIFACTS_DIR/$HASH/kibana-default-plugins.tar.gz"
tar -xzf "../$GCS_ARTIFACTS_DIR/$HASH/scalability_traces.tar.gz"

export SCALABILITY_JOURNEYS_ROOT_PATH="$KIBANA_DIR/scalability_traces/server"

node scripts/functional_tests \
  --config x-pack/test/performance/scalability/config.ts \
  --kibana-install-dir "$KIBANA_BUILD_LOCATION" \
  --debug \
  --bail

