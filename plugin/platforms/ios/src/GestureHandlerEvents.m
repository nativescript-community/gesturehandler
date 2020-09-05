#import "GestureHandlerEvents.h"

#define SAFE_VELOCITY(velocity) @(isnan(velocity) ? 0 : velocity)

//@implementation GestureHandlerEventExtraData
//
//- (instancetype)initWithData:(NSDictionary *)data;
//{
//    if ((self = [super init])) {
//        _data = data;
//    }
//    return self;
//}
//
//+ (GestureHandlerEventExtraData *)forPosition:(CGPoint)position
//                           withAbsolutePosition:(CGPoint)absolutePosition
//                            withNumberOfTouches:(NSUInteger)numberOfTouches
//{
//    return [[GestureHandlerEventExtraData alloc]
//            initWithData:@{
//                           @"x": @(position.x),
//                           @"y": @(position.y),
//                           @"absoluteX": @(absolutePosition.x),
//                           @"absoluteY": @(absolutePosition.y),
//                           @"numberOfPointers": @(numberOfTouches)}];
//}
//
//+ (GestureHandlerEventExtraData *)forPan:(CGPoint)position
//                      withAbsolutePosition:(CGPoint)absolutePosition
//                           withTranslation:(CGPoint)translation
//                              withVelocity:(CGPoint)velocity
//                       withNumberOfTouches:(NSUInteger)numberOfTouches
//{
//    return [[GestureHandlerEventExtraData alloc]
//            initWithData:@{
//                           @"x": @(position.x),
//                           @"y": @(position.y),
//                           @"absoluteX": @(absolutePosition.x),
//                           @"absoluteY": @(absolutePosition.y),
//                           @"translationX": @(translation.x),
//                           @"translationY": @(translation.y),
//                           @"velocityX": SAFE_VELOCITY(velocity.x),
//                           @"velocityY": SAFE_VELOCITY(velocity.y),
//                           @"numberOfPointers": @(numberOfTouches)}];
//}
//
//+ (GestureHandlerEventExtraData *)forForce:(CGFloat)force
//                                 forPosition:(CGPoint)position
//                        withAbsolutePosition:(CGPoint)absolutePosition
//                         withNumberOfTouches:(NSUInteger)numberOfTouches
//{
//    return [[GestureHandlerEventExtraData alloc]
//            initWithData:@{
//                           @"x": @(position.x),
//                           @"y": @(position.y),
//                           @"absoluteX": @(absolutePosition.x),
//                           @"absoluteY": @(absolutePosition.y),
//                           @"force": @(force),
//                           @"numberOfPointers": @(numberOfTouches)}];
//
//}
//
//+ (GestureHandlerEventExtraData *)forPinch:(CGFloat)scale
//                              withFocalPoint:(CGPoint)focalPoint
//                                withVelocity:(CGFloat)velocity
//                         withNumberOfTouches:(NSUInteger)numberOfTouches
//{
//    return [[GestureHandlerEventExtraData alloc]
//            initWithData:@{
//                           @"scale": @(scale),
//                           @"focalX": @(focalPoint.x),
//                           @"focalY": @(focalPoint.y),
//                           @"velocity": SAFE_VELOCITY(velocity),
//                           @"numberOfPointers": @(numberOfTouches)}];
//}
//
//+ (GestureHandlerEventExtraData *)forRotation:(CGFloat)rotation
//                                withAnchorPoint:(CGPoint)anchorPoint
//                                   withVelocity:(CGFloat)velocity
//                            withNumberOfTouches:(NSUInteger)numberOfTouches
//{
//    return [[GestureHandlerEventExtraData alloc]
//            initWithData:@{@"rotation": @(rotation),
//                           @"anchorX": @(anchorPoint.x),
//                           @"anchorY": @(anchorPoint.y),
//                           @"velocity": SAFE_VELOCITY(velocity),
//                           @"numberOfPointers": @(numberOfTouches)}];
//}
//
//+ (GestureHandlerEventExtraData *)forPointerInside:(BOOL)pointerInside
//{
//    return [[GestureHandlerEventExtraData alloc]
//            initWithData:@{@"pointerInside": @(pointerInside)}];
//}
//
//@end


@implementation GestureHandlerEvent
{
    NSNumber *_handlerTag;
    GestureHandlerState _state;
    NSDictionary *_extraData;
}

@synthesize view = _view;

- (instancetype)initWithView:(UIView *)view
                     handlerTag:(NSNumber *)handlerTag
                          state:(GestureHandlerState)state
                      extraData:(NSDictionary *)extraData
{
    if ((self = [super init])) {
        _view = view;
        _handlerTag = handlerTag;
        _state = state;
        _extraData = extraData;
    }
    return self;
}


- (NSString *)eventName
{
    return @"onGestureHandlerEvent";
}

- (BOOL)canCoalesce
{
    // TODO: event coalescing
    return NO;
}

//- (id<RCTEvent>)coalesceWithEvent:(id<RCTEvent>)newEvent;
//{
//    return newEvent;
//}

//+ (NSString *)moduleDotMethod
//{
//    return @"RCTEventEmitter.receiveEvent";
//}

- (NSArray *)arguments
{
    NSMutableDictionary *body = [NSMutableDictionary dictionaryWithDictionary:_extraData];
    [body setObject:self.view forKey:@"target"];
    [body setObject:_handlerTag forKey:@"handlerTag"];
    [body setObject:@(_state) forKey:@"state"];
    return @[self.view, @"onGestureHandlerEvent", body];
}

@end


@implementation GestureHandlerStateChange
{
    NSNumber *_handlerTag;
    UIView *_view;
    GestureHandlerState _state;
    GestureHandlerState _prevState;
    NSDictionary *_extraData;
}

@synthesize view = _view;

- (instancetype)initWithView:(UIView *)view
                     handlerTag:(NSNumber *)handlerTag
                          state:(GestureHandlerState)state
                      prevState:(GestureHandlerState)prevState
                      extraData:(NSDictionary *)extraData
{
    if ((self = [super init])) {
        _view = view;
        _handlerTag = handlerTag;
        _state = state;
        _prevState = prevState;
        _extraData = extraData;
    }
    return self;
}

//RCT_NOT_IMPLEMENTED(- (instancetype)init)

- (NSString *)eventName
{
    return @"onGestureHandlerStateChange";
}

- (BOOL)canCoalesce
{
    // TODO: event coalescing
    return NO;
}

//- (id<RCTEvent>)coalesceWithEvent:(id<RCTEvent>)newEvent;
//{
//    return newEvent;
//}

//+ (NSString *)moduleDotMethod
//{
//    return @"RCTEventEmitter.receiveEvent";
//}

- (NSArray *)argumentsx
{
    NSMutableDictionary *body = [NSMutableDictionary dictionaryWithDictionary:_extraData];
    [body setObject:_view forKey:@"target"];
    [body setObject:_handlerTag forKey:@"handlerTag"];
    [body setObject:@(_state) forKey:@"state"];
    [body setObject:@(_prevState) forKey:@"oldState"];
    return @[self.view, @"onGestureHandlerStateChange", body];
}

@end
