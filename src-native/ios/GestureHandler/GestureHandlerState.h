#import <Foundation/Foundation.h>

typedef NS_ENUM(NSInteger, GestureHandlerState) {
    GestureHandlerStateUndetermined = 0,
    GestureHandlerStateFailed,
    GestureHandlerStateBegan,
    GestureHandlerStateCancelled,
    GestureHandlerStateActive,
    GestureHandlerStateEnd,
};
