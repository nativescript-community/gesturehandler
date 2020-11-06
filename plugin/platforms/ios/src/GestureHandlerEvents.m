#import "GestureHandlerEvents.h"

#define SAFE_VELOCITY(velocity) @(isnan(velocity) ? 0 : velocity)

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
