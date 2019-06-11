
#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

#import "GestureHandlerState.h"

@interface GestureHandlerEventExtraData : NSObject

@property (readonly) NSDictionary *data;

- (instancetype)initWithData:(NSDictionary *)data;

+ (GestureHandlerEventExtraData *)forPosition:(CGPoint)position
                           withAbsolutePosition:(CGPoint)absolutePosition
                            withNumberOfTouches:(NSUInteger)numberOfTouches;
+ (GestureHandlerEventExtraData *)forPan:(CGPoint)position
                      withAbsolutePosition:(CGPoint)absolutePosition
                           withTranslation:(CGPoint)translation
                              withVelocity:(CGPoint)velocity
                       withNumberOfTouches:(NSUInteger)numberOfTouches;
+ (GestureHandlerEventExtraData *)forForce:(CGFloat)force
                                 forPosition:(CGPoint)position
                        withAbsolutePosition:(CGPoint)absolutePosition
                         withNumberOfTouches:(NSUInteger)numberOfTouches;
+ (GestureHandlerEventExtraData *)forPinch:(CGFloat)scale
                              withFocalPoint:(CGPoint)focalPoint
                                withVelocity:(CGFloat)velocity
                         withNumberOfTouches:(NSUInteger)numberOfTouches;
+ (GestureHandlerEventExtraData *)forRotation:(CGFloat)rotation
                                withAnchorPoint:(CGPoint)anchorPoint
                                   withVelocity:(CGFloat)velocity
                            withNumberOfTouches:(NSUInteger)numberOfTouches;
+ (GestureHandlerEventExtraData *)forPointerInside:(BOOL)pointerInside;
@end

@interface GestureHandlerEvent : NSObject
@property (readonly) UIView *view;

- (instancetype)initWithView:(UIView *)view
                     handlerTag:(NSNumber *)handlerTag
                          state:(GestureHandlerState)state
                      extraData:(GestureHandlerEventExtraData*)extraData NS_DESIGNATED_INITIALIZER;

@end


@interface GestureHandlerStateChange : NSObject
@property (readonly) UIView *view;

- (instancetype)initWithView:(UIView *)view
                     handlerTag:(NSNumber *)handlerTag
                          state:(GestureHandlerState)state
                      prevState:(GestureHandlerState)prevState
                      extraData:(GestureHandlerEventExtraData*)extraData NS_DESIGNATED_INITIALIZER;

@end
