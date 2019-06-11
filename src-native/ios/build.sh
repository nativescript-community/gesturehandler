set -e
set -o pipefail

CURRENT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

SOURCE_NAME="GestureHandler"
IOS_SOURCE_DIR="$CURRENT_DIR"

cd $IOS_SOURCE_DIR
xcodebuild -project GestureHandler.xcodeproj -scheme universal
