#!/bin/bash

# Chirui Reader Android - Development Helper Script
# This script provides shortcuts for common development tasks

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Print colored messages
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ $1${NC}"
}

# Check if we're in the android directory
if [ ! -f "gradlew" ]; then
    print_error "This script must be run from the android/ directory"
    exit 1
fi

# Display help
show_help() {
    echo "Chirui Reader Android - Development Helper"
    echo ""
    echo "Usage: ./dev.sh [command]"
    echo ""
    echo "Commands:"
    echo "  build         Build debug APK"
    echo "  release       Build release APK"
    echo "  install       Build and install debug APK on connected device"
    echo "  test          Run unit tests"
    echo "  lint          Run ktlint checks"
    echo "  format        Auto-format code with ktlint"
    echo "  clean         Clean build outputs"
    echo "  tasks         List all available Gradle tasks"
    echo "  help          Show this help message"
    echo ""
}

# Main command handler
case "$1" in
    build)
        print_info "Building debug APK..."
        ./gradlew assembleDebug
        print_success "Build completed! APK: app/build/outputs/apk/debug/app-debug.apk"
        ;;
    
    release)
        print_info "Building release APK..."
        ./gradlew assembleRelease
        print_success "Build completed! APK: app/build/outputs/apk/release/app-release.apk"
        ;;
    
    install)
        print_info "Building and installing debug APK..."
        ./gradlew installDebug
        print_success "App installed on device!"
        ;;
    
    test)
        print_info "Running unit tests..."
        ./gradlew test
        print_success "Tests completed!"
        ;;
    
    lint)
        print_info "Running ktlint checks..."
        ./gradlew ktlintCheckAll
        print_success "Lint checks completed!"
        ;;
    
    format)
        print_info "Formatting code with ktlint..."
        ./gradlew ktlintFormatAll
        print_success "Code formatted!"
        ;;
    
    clean)
        print_info "Cleaning build outputs..."
        ./gradlew clean
        print_success "Clean completed!"
        ;;
    
    tasks)
        print_info "Available Gradle tasks:"
        ./gradlew tasks
        ;;
    
    help|--help|-h|"")
        show_help
        ;;
    
    *)
        print_error "Unknown command: $1"
        echo ""
        show_help
        exit 1
        ;;
esac
