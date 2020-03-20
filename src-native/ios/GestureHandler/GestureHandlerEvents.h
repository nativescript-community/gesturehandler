
#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

#import "GestureHandlerState.h"

#define SAFE_VELOCITY(velocity) @(isnan(velocity) ? 0 : velocity)


@interface GestureHandlerEvent : NSObject
@property (readonly) UIView *view;

- (instancetype)initWithView:(UIView *)view
                     handlerTag:(NSNumber *)handlerTag
                          state:(GestureHandlerState)state
                      extraData:(NSMutableDictionary*)extraData NS_DESIGNATED_INITIALIZER;

@end


@interface GestureHandlerStateChange : NSObject
@property (readonly) UIView *view;

- (instancetype)initWithView:(UIView *)view
                     handlerTag:(NSNumber *)handlerTag
                          state:(GestureHandlerState)state
                      prevState:(GestureHandlerState)prevState
                      extraData:(NSMutableDictionary*)extraData NS_DESIGNATED_INITIALIZER;

@end
